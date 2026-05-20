import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import styles from "./CheckList.module.css";
import { API_BASE_URL } from "../../config";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface CheckListItem {
    plan_id: number;
    id?: number;
    item: string;
    checked: number;
}

function CheckList() {
    const { planId } = useParams<{ planId?: string }>();
    const navigate = useNavigate();

    const [items, setItems] = useState<CheckListItem[]>([]);

    useEffect(() => {
        const fetchChecklist = async () => {
            try {
                if (planId) {
                    const response = await axios.get(`${API_BASE_URL}/checklist/${planId}`);
                    const data = response.data;
                    console.log(data);
                    if (data && data.length > 0) {
                        setItems(data);
                    } else {
                        setItems([{ item: "", checked: 0, plan_id: parseInt(planId, 10) }]);
                    }
                } else {
                    console.warn("Plan ID가 URL 파라미터에 없습니다.");
                }
            } catch (error) {
                console.error("Error fetching checklist:", error);
                setItems([{ item: "", checked: 0, plan_id: planId ? parseInt(planId, 10) : 0 }]);
            }
        };

        fetchChecklist();
    }, [planId]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter") {
            if (e.currentTarget.value.trim() !== "" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                if (!planId) {
                    console.error("Plan ID is missing.");
                    return;
                }
                const newItem: Omit<CheckListItem, 'id'> = {
                    plan_id: parseInt(planId, 10),
                    item: "",
                    checked: 0,
                };
                const updatedItems = [...items];
                updatedItems[index].item = e.currentTarget.value.trim();
                updatedItems.splice(index + 1, 0, newItem as CheckListItem);
                setItems(updatedItems);
                setTimeout(() => {
                    const nextInput = document.querySelector(
                        `input[type="text"][data-index="${index + 1}"]`
                    ) as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                }, 0);
            }
        } else if (e.key === "Backspace") {
            if (items[index].item === "" && items.length > 1) {
                e.preventDefault();
                const updatedItems = items.filter((_, i) => i !== index);
                setItems(updatedItems);
                if (index > 0) {
                    setTimeout(() => {
                        const prevInput = document.querySelector(
                            `input[type="text"][data-index="${index - 1}"]`
                        ) as HTMLInputElement;
                        if (prevInput) prevInput.focus();
                    }, 0);
                }
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedItems = [...items];
        updatedItems[index].item = e.target.value;
        setItems(updatedItems);
    };

    const handleDelete = (index: number) => {
        if (items.length > 1) {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);
        } else {
            setItems([{ item: "", checked: 0, plan_id: planId ? parseInt(planId, 10) : 0 }]);
        }
    };

    const handleCheckboxChange = (index: number) => {
        const updatedItems = [...items];
        updatedItems[index].checked = updatedItems[index].checked === 0 ? 1 : 0;
        setItems(updatedItems);
    };

    const sendItemsToBackend = async () => {
        try {
            const itemsToSend = items.map(({ id, ...rest }) => rest);
            console.log("input data :", JSON.stringify(itemsToSend));
            const response = await axios.post(`${API_BASE_URL}/checklist/${planId}`, itemsToSend);
            console.log("Success:", response);
        } catch (error) {
            console.error("Error sending data to backend:", error);
        }
    };

    const handleSaveAndGoBack = async () => {
        try {
            await sendItemsToBackend();
            navigate(`/plans/${planId}`);
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    return (
        <div className={styles.checkList_container}>
            <div className={styles.checkList_header_container}>
                <div className={styles.checkList_header_contents}>
                    <div className={styles.checkList_header_title}>
                        <div>Check List</div>
                    </div>
                    <button
                        className={styles.checkList_header_close_button}
                        onClick={handleSaveAndGoBack}
                    >
                        <img
                            className={styles.checkList_header_close_button_img}
                            src="/icons/close_gray.jpg"
                            alt="close icon"
                        />
                    </button>
                </div>
            </div>
            <div className={styles.checkList_main_container}>
                <div className={styles.checkList_main_contents}>
                    {items.map((item, index) => (
                        <div key={item.id || index} className={styles.checkList_main_content}>
                            <input
                                type="checkbox"
                                id={`checkbox-${index}`}
                                checked={item.checked === 1}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <input
                                type="text"
                                value={item.item}
                                data-index={index}
                                placeholder={
                                    items.length === 1 && index === 0
                                        ? "추가 항목을 입력해주세요"
                                        : ""
                                }
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onChange={(e) => handleChange(e, index)}
                            />
                            <span onClick={() => handleDelete(index)}>삭제</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CheckList;
