import React, { useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import bgImage from "../images/Blackboard-bg4.JPG"; 

const DrawingApp = () => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [shape, setShape] = useState({color: "white", width: 5});
    const [addingText, setAddingText] = useState(false);
    const [textBoxes, setTextBoxes] = useState([]);
    const [isEraser, setIsEraser] = useState(false);
    const [draggingBox, setDraggingBox] = useState(null);
    const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
    const [addingImage, setAddingImage] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const canvasWidth = 1920;
    const canvasHeight = 900;

    const colors = [
        { value: "white", label: "하얀색" }, 
        { value: "palevioletred", label: "빨간색" }, 
        { value: "yellow",label: "노란색" },
        { value: "skyblue", label: "파란색" },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
    
        const img = new Image();
        img.src = bgImage;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            saveHistory();
        };
    }, []);

    const getCanvasCoordinates = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        return {x, y};
    };

    const saveHistory = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
            canvas: dataURL,
            textBoxes: [...textBoxes],
        });
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const restoreCanvas = (state) => {
        const { canvas: dataURL, textBoxes: savedTextBoxes } = state;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        };
        img.src = dataURL;

        setTextBoxes(savedTextBoxes);
    };  
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = () => {
                setImageFile(img); 
                saveHistory();
            };
            img.src = URL.createObjectURL(file);
            setAddingImage(true);
        }
    };

    const handleMouseDown = (e) => {
        if (addingText) {
            const { x, y } = getCanvasCoordinates(e);
            addTextBox(x, y);
            setAddingText(false);
        } else if (addingImage && imageFile) {
            const { x, y } = getCanvasCoordinates(e);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(imageFile, x, y, imageFile.width, imageFile.height);

            saveHistory();
            setAddingImage(false);
        } else {
            const { x, y } = getCanvasCoordinates(e);
            const ctx = canvasRef.current.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(x, y);
            setDrawing(true);
        }
    };  
    
    const handleMouseMove = (e) => {
        if (drawing) {
            const {x, y} = getCanvasCoordinates(e);
            const ctx = canvasRef.current.getContext("2d");
            ctx.lineTo(x, y);
            ctx.strokeStyle = isEraser ? "#194038" : shape.color;
            ctx.lineWidth = shape.width;
            ctx.stroke();
        }
    };

    const handleMouseUp = () => {
        if (drawing) {
            setDrawing(false);
            saveHistory();
        }
    };

    const toggleEraser = () => {
        setIsEraser((prev) => !prev);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            restoreCanvas(history[newIndex]);
        }
    };
    
    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            restoreCanvas(history[newIndex]);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'z') {
                undo();
            } else if (e.ctrlKey && e.key === 'y') {
                redo();
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [history, historyIndex]);

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = bgImage;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            saveHistory();
        };

        setTextBoxes([]);
        setImageFile(null);
        setAddingImage(false);
        saveHistory();
    };
    
    const addTextBox = (x, y) => {
        const newTextBox = { x, y, text: "", id: Date.now(), fontSize: 16 };
        setTextBoxes((prev) => {
            const updatedTextBoxes = [...prev, newTextBox];
            return updatedTextBoxes;
        });
        saveHistory();
    };

    const handleTextChange = (id, newText) => {
        setTextBoxes((prev) => prev.map((box) => (box.id === id ? {...box, text: newText} : box)));
    };

    const handleFontSizeChange = (id, newFontSize) => {
        setTextBoxes((prev) => prev.map((box) => box.id === id ? {...box, fontSize: newFontSize} : box));
    };

    const handleDragStart = (id, e) => {
        const box = textBoxes.find((box) => box.id === id);
        const offsetX = e.clientX - box.x;
        const offsetY = e.clientY - box.y;
        setDraggingBox(id);
        setDragOffset({x: offsetX, y: offsetY});
    };

    const handleDrag = (e) => {
        if (draggingBox !== null) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const newX = Math.min(Math.max(e.clientX - dragOffset.x, 0), rect.width - 100);
            const newY = Math.min(Math.max(e.clientY - dragOffset.y, 0), rect.height - 20);

            setTextBoxes((prev) =>
                prev.map((box) => (box.id === draggingBox ? { ...box, x: newX, y: newY } : box))
            );
        }
    };

    const handleDragEnd = () => setDraggingBox(null);

    const saveCanvas = () => {
        const canvas = canvasRef.current;

        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        const offscreenCtx = offscreenCanvas.getContext("2d");

        offscreenCtx.drawImage(canvas, 0, 0);

        textBoxes.forEach(({ x, y, text, fontSize }) => 
        {
            offscreenCtx.font = `${fontSize}px Arial`;
            offscreenCtx.fillStyle = "white";
            offscreenCtx.textBaseline = "top";
    
            const lines = text.split("\n");
            lines.forEach((line, index) => 
            {
                const lineY = y + index * fontSize * 1.2;
                if (lineY + fontSize <= canvas.height) 
                {
                    offscreenCtx.fillText(line, x, y + (index * fontSize));
                }
            });
        });

        const image = offscreenCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "drawing.png";
        link.href = image;
        link.click();
    };

    return (
        <div
            style={styles.container}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
        >
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={styles.canvas}
            />
            <div style={styles.ironFrame}>
                <div style={styles.chalkHolder}/>
            </div>
            {textBoxes.map(({x, y, text, id, fontSize}) => (
                <ResizableDraggableTextarea
                    key={id}
                    x={x}
                    y={y}
                    text={text}
                    fontSize={fontSize}
                    id={id}
                    onTextChange={handleTextChange}
                    onDragStart={handleDragStart}
                    onFontSizeChange={handleFontSizeChange}
                />
            ))}
            <div style={styles.toolbar}>
                <label>
                    <div style={styles.buttonContainer}>
                        {colors.map(({value, label}) => (<button
                                key={value}
                                onClick={() => {
                                    setShape((prev) => ({...prev, color: value}));
                                    setIsEraser(false);
                                }}
                                style={{
                                    ...styles.colorButton,
                                    backgroundColor: value,
                                    border: `2px solid ${shape.color === value ? "black" : "transparent"}`,
                                    transform: shape.color === value ? "scale(1.1)" : "scale(1)",
                                    transition: "transform 0.2s ease, border 0.2s ease",
                                }}
                                aria-label={label}
                                title={label}
                            />))}
                        <input
                            type="range"
                            name="width"
                            min="1"
                            max="30"
                            value={shape.width}
                            onChange={(e) => setShape((prev) => ({...prev, width: e.target.value}))}
                            style={{
                                ...styles.widthInput, background: shape.color
                            }}
                        />
                        <span style={{...styles.widthLabel, fontWeight: "bold" }}>{shape.width} / 30</span>
                        <div style={styles.iconButtons}>
                            <button 
                                type="button"
                                onClick={undo} 
                                style={styles.iconButton}
                                disabled={historyIndex <= 0}>
                                <i className="fas fa-undo" title="되돌리기 (Ctrl + Z)"/>
                            </button>
                            <button 
                                type="button"
                                onClick={redo} 
                                style={styles.iconButton}
                                disabled={historyIndex >= history.length - 1}>
                                <i className="fas fa-redo" title="다시 실행 (Ctrl + Y)"/>
                            </button>
                            <button
                                onClick={toggleEraser}
                                style={{
                                    ...styles.iconButton, backgroundColor: isEraser ? "#aaa" : "transparent",
                                }}
                                title={isEraser ? "지우개 (ON)" : "지우개 (OFF)"}
                            >
                                <i className={`fas fa-eraser ${isEraser ? "active" : ""}`}/>
                            </button>
                            <button
                                onClick={handleClear}
                                style={styles.iconButton}
                                title="전부 지우기"
                            >
                                <i className="fas fa-trash-alt"/>
                            </button>
                            <button
                                onClick={() => setAddingText(true)}
                                style={styles.iconButton}
                                title="텍스트 박스 추가"
                            >
                                <i className="fas fa-font"/>
                            </button>
                            <button
                                type="button"
                                onClick={() => document.getElementById("fileInput").click()}
                                style={styles.iconButton}
                            >
                                <i className="fas fa-upload" title="이미지 올리기"/>
                            </button>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                style={styles.fileInput}
                                ref={(input) => {
                                    if (input) {
                                        input.value = "";
                                    }
                                }}
                            />
                            <button
                                onClick={saveCanvas}
                                style={styles.iconButton}
                                title="저장"
                            >
                                <i className="fas fa-save"/>
                            </button>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
};

const ResizableDraggableTextarea = ({x, y, text, fontSize, id, onTextChange, onDragStart, onFontSizeChange}) => {
    const {ref, width, height} = useResizeDetector({
        onResize: () => {
            if (textareaRef.current && width && height) {
                const newFontSize = Math.max(12, Math.min(width / 10, height / 2));
                onFontSizeChange(id, newFontSize);
            }
        },
    });

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    useEffect(() => {
        if (width && height && textareaRef.current) {
            const newFontSize = Math.max(12, Math.min(width / 10, height / 2));
            textareaRef.current.style.fontSize = `${newFontSize}px`;
        }
    }, [width, height]);

    return (
        <div
            style={{
                position: "absolute", left: x, top: y,
            }}
        >
            <textarea
                ref={(el) => {
                    textareaRef.current = el;
                    ref(el);
                }}
                value={text}
                onChange={(e) => onTextChange(id, e.target.value)}
                style={{
                    ...styles.textBox, fontSize: `${fontSize}px`
                }}
            />
            <div
                onMouseDown={(e) => onDragStart(id, e)}
                style={styles.textDrag}
            />
        </div>
    );
};

const styles = {
    container: {
        position: "relative", width: "100%", maxWidth: "100%", margin: "0 auto"
    },

    canvas: {
        width: "100%", height: "auto", border: "1px solid black"
    },

    image: {
        position: "absolute"
    },

    ironFrame: {
        width: "100%",
        height: "55px",
        background: "linear-gradient(135deg, #e0e0e0, #b0b0b0, #e0e0e0)",
        borderTop: "5px solid #a0a0a0",
        borderRadius: "0 0 10px 10px",
        marginTop: "-6px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)"
    },

    chalkHolder: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        width: "99%",
        height: "30px",
        background: "linear-gradient(135deg, #d8d8d8, #c0c0c0, #d8d8d8)",
        borderRadius: "15px",
        padding: "5px",
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3), 0px 4px 6px rgba(0, 0, 0, 0.3)"
    },

    toolbar: {
        marginTop: "-38px", marginLeft: "25px", display: "flex", alignItems: "center"
    },

    buttonContainer: {
        display: "flex", gap: "10px", alignItems: "center"
    },

    colorButton: {
        width: "50px",
        height: "10px",
        borderRadius: "2px",
        boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        outline: "none"
    },

    widthInput: {
        border: "1px solid black", borderRadius: "5px", height: "10px", appearance: "none",
    },

    widthLabel: {
        width: "56px",
    },

    iconButtons: {
        display: "flex", gap: "13px", alignItems: "center"
    },

    iconButton: {
        background: "transparent", border: "transparent", borderRadius: "5px", cursor: "pointer", fontSize: "18px",
    },

    fileInput: {
        display: "none",
    },

    textBox: {
        resize: "both",
        overflow: "hidden",
        color: "white",
        backgroundColor: "transparent",
        border: "none",
        minWidth: "100px",
        fontFamily: "inherit",
        lineHeight: "1.2",
    },

    textDrag: {
        position: "absolute",
        left: -10,
        top: -10,
        width: "10px",
        height: "10px",
        backgroundColor: "gray",
        cursor: "move",
        borderRadius: "50%",
    }
};

export default DrawingApp; 