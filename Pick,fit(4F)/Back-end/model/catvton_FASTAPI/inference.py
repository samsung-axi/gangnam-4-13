import os
import numpy as np
import torch
import argparse
from torch.utils.data import Dataset, DataLoader
from diffusers.image_processor import VaeImageProcessor
from tqdm import tqdm
from PIL import Image, ImageFilter
from model.pipeline import CatVTONPipeline


class InferenceDataset(Dataset):
    def __init__(self, args):
        self.args = args
        self.vae_processor = VaeImageProcessor(vae_scale_factor=8) 
        self.mask_processor = VaeImageProcessor(vae_scale_factor=8, do_normalize=False, do_binarize=True, do_convert_grayscale=True) 
        self.data = self.load_data()    
    def load_data(self):
        return []
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        data = self.data[idx]
        for key in ['person', 'cloth', 'mask']:
            person, cloth, mask = [Image.open(data[key]) for key in ['person', 'cloth', 'mask']]
            return {
            'index': idx,
            'person_name': data['person_name'],
            'person': self.vae_processor.preprocess(person, self.args.height, self.args.width)[0],
            'cloth': self.vae_processor.preprocess(cloth, self.args.height, self.args.width)[0],
            'mask': self.mask_processor.preprocess(mask, self.args.height, self.args.width)[0]
            }

# class trenbeTestDataset(InferenceDataset):
#     def load_data(self):        
#         pair_txt = os.path.join(self.args.data_root_path, "test",'test_pairs_paired.txt')
#         if not os.path.exists(pair_txt):  # 로그 추가
#             raise FileNotFoundError(f"Pair file not found: {pair_txt}")
#         print(f"Loading pair file: {pair_txt}", flush=True)  # 로그 추가
        
#         with open(pair_txt, 'r') as f:
#             lines = f.readlines()
        
#         output_dir = os.path.join(self.args.output_dir, "trenbe", 'result')
#         data = []
#         for line in lines:
#             person_img, cloth_img = line.strip().split(" ")
#             cloth_img = person_img 
#             data.append({
#             'person_name': person_img,
#             'person': os.path.join(self.args.data_root_path, 'test', 'images', person_img),
#             'cloth': os.path.join(self.args.data_root_path, 'test', 'cloth', cloth_img),
#             'mask': os.path.join(self.args.data_root_path, 'test', 'agnostic_masks', person_img.replace('.jpg', '.png')),
#         })
#         print(f"Loaded {len(data)} pairs from pair file.", flush=True)  # 로그 추가
#         return data
                   
       
def parse_args():
    parser = argparse.ArgumentParser(description="Simple example of a training script.")
    parser.add_argument(
        "--base_model_path",
        type=str,
        default="booksforcharlie/stable-diffusion-inpainting",  
        help=( "The path to the base model to use for evaluation. This can be a local path or a model identifier from the Model Hub."),
    )
    parser.add_argument(
        "--resume_path",
        type=str,
        default="zhengchong/CatVTON",
        help=("The Path to the checkpoint of trained tryon model."),
    )
    # parser.add_argument(
    #     "--dataset_name",
    #     type=str,
    #     required=True,
    #     help="The datasets to use for evaluation.",
    # )
    # parser.add_argument(
    #     "--data_root_path", 
    #     type=str, 
    #     required=True,
    #     help="Path to the dataset to evaluate."
    # )
    parser.add_argument(
        "--output_dir",
        type=str,
        default="output",
        help="The output directory where the model predictions will be written.",
    )

    parser.add_argument(
        "--seed", type=int, default=555, help="A seed for reproducible evaluation."
    )
    # parser.add_argument(
    #     "--batch_size", type=int, default=8, help="The batch size for evaluation."
    # )
    
    parser.add_argument(
        "--num_inference_steps",
        type=int,
        default=50, #default = 50  #이미지를 생성하는 동안 실행하는 단계 수
        help="Number of inference steps to perform.",
    )
    parser.add_argument(
        "--guidance_scale",
        type=float,
        default=2.5,
        help="The scale of classifier-free guidance for inference.",
    )

    parser.add_argument(
        "--width",
        type=int,
        default=384,
        help=( "The resolution for input images, all the images in the train/validation dataset will be resized to this resolution"),
    )
    parser.add_argument(
        "--height",
        type=int,
        default=512,
        help=( "The resolution for input images, all the images in the train/validation dataset will be resized to this resolution"),
    )
    parser.add_argument(
        "--repaint", 
        action="store_true", 
        help="Whether to repaint the result image with the original background."
    )
   
    parser.add_argument(
        "--concat_eval_results",
        action="store_true",
        help="Whether or not to concatenate the all conditions into one image.",
    )
    parser.add_argument(
        "--allow_tf32",
        action="store_true",
        default=True,
        help=( "Whether or not to allow TF32 on Ampere GPUs. Can be used to speed up training."),
    )
    # parser.add_argument(
    #     "--dataloader_num_workers",
    #     type=int,
    #     default=8,
    #     help=( "Number of subprocesses to use for data loading."),
    # )
    parser.add_argument(
        "--mixed_precision",
        type=str,
        default="bf16",
        choices=["no", "fp16", "bf16"],
        help=( "Whether to use mixed precision."),
    )
    # parser.add_argument(
    #     "--concat_axis",
    #     type=str,
    #     choices=["x", "y", 'random'],
    #     default="y",
    #     help="The axis to concat the cloth feature, select from ['x', 'y', 'random'].",
    # )
    parser.add_argument(
        "--enable_condition_noise",
        action="store_true",
        default=True,
        help="Whether or not to enable condition noise.",
    )
    
    args = parser.parse_args()

    env_local_rank = int(os.environ.get("LOCAL_RANK", -1))
    if env_local_rank != -1 and env_local_rank != args.local_rank:
        args.local_rank = env_local_rank
    return args

def repaint(person, mask, result):
    _, h = result.size
    kernal_size = h // 100 #50 더 세부적인 디테일 살려보기
    if kernal_size % 2 == 0:
        kernal_size += 1
    mask = mask.filter(ImageFilter.GaussianBlur(kernal_size))
    person_np = np.array(person)
    result_np = np.array(result)
    mask_np = np.array(mask) / 255
    mask_np = np.expand_dims(mask_np, axis=-1)  # (512, 384) -> (512, 384, 1)
    mask_np = np.repeat(mask_np, 3, axis=-1)     # (512, 384, 1) -> (512, 384, 3)
    repaint_result = person_np * (1 - mask_np) + result_np * mask_np
    repaint_result = Image.fromarray(repaint_result.astype(np.uint8))
    return repaint_result

# def to_pil_image(images):
#     images = (images / 2 + 0.5).clamp(0, 1)
#     images = images.cpu().permute(0, 2, 3, 1).float().numpy()
#     if images.ndim == 3:
#         images = images[None, ...]
#     images = (images * 255).round().astype("uint8")
#     if images.shape[-1] == 1:
#         pil_images = [Image.fromarray(image.squeeze(), mode="L") for image in images]
#     else:
#         pil_images = [Image.fromarray(image) for image in images]
#     return pil_images

@torch.no_grad()
def main():
    args = parse_args()
    print("Initializing CatVTONPipeline...", flush=True)  # 로그 추가
    pipeline = CatVTONPipeline(
        attn_ckpt_version='mix',
        attn_ckpt=args.resume_path,
        base_ckpt=args.base_model_path,
        weight_dtype={
            "no": torch.float32,
            "fp16": torch.float16,
            "bf16": torch.bfloat16,
        }[args.mixed_precision],
        device="cuda",
        skip_safety_check=True
    )
    print("CatVTONPipeline initialized successfully.", flush=True)  # 로그 추가

    # if args.dataset_name == "trenbe":
    #     dataset = trenbeTestDataset(args)
    # else:
    #     raise ValueError(f"Invalid dataset name {args.dataset}.")
    
    # if len(dataset) == 0:
    #     raise ValueError("Dataset is empty. Please check data loading.")
    # dataloader = DataLoader(
    #     dataset,
    #     batch_size=args.batch_size,
    #     shuffle=False,
    #     num_workers=args.dataloader_num_workers
    # )

    generator = torch.Generator(device='cuda').manual_seed(args.seed)
    person_images = Image.open('trenbe/test/images')
    cloth_images = Image.open('trenbe/test/cloth')
    masks = Image.open('trenbe/test/agnostic_masks')

    results = pipeline(
        person_images,
        cloth_images,
        masks,
        num_inference_steps=args.num_inference_steps,
        guidance_scale=args.guidance_scale,
        height=args.height,
        width=args.width,
        generator=generator,
    )        
    output_dir = os.path.join(output_dir)
    results.save(output_dir)

if __name__ == "__main__":
    main()
