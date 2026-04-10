import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import toast from "react-hot-toast";
import "../style/Whiteboard.css";
import { MousePointer2, Pen, Square, Circle, Triangle, Type, Undo, Redo, Copy, XCircle, Trash2, Save, Home } from "lucide-react";

// Import fabric from the CommonJS distribution
import { fabric } from "fabric/dist/fabric";


const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [currentTool, setCurrentTool] = useState("select");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const navigate = useNavigate();

  // Initialize Fabric.js canvas
  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth * 0.98,
      height: window.innerHeight * 0.85,
      backgroundColor: "#f5f5f5",
      preserveObjectStacking: true,
      selection: true,
      isDrawingMode: false,
    });

    setCanvas(fabricCanvas);

    const handleResize = () => {
      fabricCanvas.setDimensions({
        width: window.innerWidth * 0.98,
        height: window.innerHeight * 0.85,
      });
      fabricCanvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      fabricCanvas.dispose();
    };
  }, []);

  // Tool Switching and Canvas Behavior
  useEffect(() => {
    if (!canvas) return;

    canvas.isDrawingMode = currentTool === "pen";
    canvas.selection = currentTool === "select";

    if (currentTool === "pen") {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = currentColor;
      canvas.freeDrawingBrush.width = brushSize;
    }

    canvas.forEachObject((obj) => {
      obj.selectable = currentTool === "select";
    });

    canvas.renderAll();
  }, [canvas, currentTool, currentColor, brushSize]);

  // Handle Drawing Shapes
  const handleMouseDown = (e) => {
    if (!canvas || currentTool === "select" || currentTool === "pen") return;

    const pointer = canvas.getPointer(e.e);
    setStartPos({ x: pointer.x, y: pointer.y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!canvas || !isDrawing || !startPos) return;

    const pointer = canvas.getPointer(e.e);
    const width = pointer.x - startPos.x;
    const height = pointer.y - startPos.y;

    canvas.remove(canvas.tempShape); // Remove previous temp shape

    let tempShape;
    switch (currentTool) {
      case "rectangle":
        tempShape = new fabric.Rect({
          left: startPos.x,
          top: startPos.y,
          width,
          height,
          fill: "transparent",
          stroke: currentColor,
          strokeWidth: brushSize,
        });
        break;
      case "circle":
        tempShape = new fabric.Ellipse({
          left: startPos.x,
          top: startPos.y,
          rx: Math.abs(width) / 2,
          ry: Math.abs(height) / 2,
          fill: "transparent",
          stroke: currentColor,
          strokeWidth: brushSize,
        });
        break;
      case "triangle":
        tempShape = new fabric.Triangle({
          left: startPos.x,
          top: startPos.y,
          width: Math.abs(width),
          height: Math.abs(height),
          fill: "transparent",
          stroke: currentColor,
          strokeWidth: brushSize,
        });
        break;
      default:
        return;
    }
    canvas.tempShape = tempShape;
    canvas.add(tempShape);
    canvas.renderAll();
  };

  const handleMouseUp = () => {
    if (!canvas || !isDrawing) return;

    setIsDrawing(false);
    setStartPos(null);
    saveState();
    delete canvas.tempShape;
    setCurrentTool("select"); // Switch back to select after drawing
  };

  useEffect(() => {
    if (!canvas) return;

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [canvas, currentTool, currentColor, brushSize, isDrawing, startPos]);

  // Add Text
  const addText = () => {
    if (!canvas) return;

    const text = new fabric.IText("Edit me", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fill: currentColor,
      fontSize: 20,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    saveState();
    setCurrentTool("select");
  };

  // History Management (Undo/Redo)
  const saveState = () => {
    const json = canvas.toJSON();
    setHistory((prev) => [...prev, json]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setRedoStack((prev) => [...prev, canvas.toJSON()]);
    setHistory((prev) => prev.slice(0, -1));
    canvas.loadFromJSON(lastState, canvas.renderAll.bind(canvas));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, canvas.toJSON()]);
    setRedoStack((prev) => prev.slice(0, -1));
    canvas.loadFromJSON(nextState, canvas.renderAll.bind(canvas));
  };

  // Utility Functions
  const copySelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.clone((cloned) => {
        cloned.set({ left: cloned.left + 20, top: cloned.top + 20 });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        saveState();
      });
    }
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    canvas.discardActiveObject();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.renderAll();
    saveState();
    toast.success("Deleted");
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.setBackgroundColor("#f5f5f5", canvas.renderAll.bind(canvas));
    setHistory([]);
    setRedoStack([]);
    toast.success("Canvas cleared");
  };

  const downloadCanvas = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: "png", quality: 1 });
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = dataURL;
    link.click();
    toast.success("Downloaded");
  };

  return (
    <div className="whiteboard-container">
      <div className="toolbar">
        <div className="tool-group">
          <button
            className={`tool-button ${currentTool === "select" ? "active" : ""}`}
            onClick={() => setCurrentTool("select")}
          >
            <MousePointer2 size={16} /> Select
          </button>
          <button
            className={`tool-button ${currentTool === "pen" ? "active" : ""}`}
            onClick={() => setCurrentTool("pen")}
          >
            <Pen size={16} /> Pen
          </button>
          <button
            className={`tool-button ${currentTool === "rectangle" ? "active" : ""}`}
            onClick={() => setCurrentTool("rectangle")}
          >
            <Square size={16} /> Rectangle
          </button>
          <button
            className={`tool-button ${currentTool === "circle" ? "active" : ""}`}
            onClick={() => setCurrentTool("circle")}
          >
            <Circle size={16} /> Circle
          </button>
          <button
            className={`tool-button ${currentTool === "triangle" ? "active" : ""}`}
            onClick={() => setCurrentTool("triangle")}
          >
            <Triangle size={16} /> Triangle
          </button>
          <button className="tool-button" onClick={addText}>
            <Type size={16} /> Text
          </button>
        </div>

        <div className="tool-group">
          <div className="color-picker-container">
            <button
              className="color-button"
              style={{ backgroundColor: currentColor }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <div className="color-picker-popover">
                <HexColorPicker color={currentColor} onChange={setCurrentColor} />
              </div>
            )}
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="brush-size-slider"
          />
        </div>

        <div className="tool-group">
          <button className="tool-button" onClick={undo}>
            <Undo size={16} /> Undo
          </button>
          <button className="tool-button" onClick={redo}>
            <Redo size={16} /> Redo
          </button>
          <button className="tool-button" onClick={copySelected}>
            <Copy size={16} /> Copy
          </button>
          <button className="tool-button delete" onClick={deleteSelected}>
            <XCircle size={16} /> Delete
          </button>
          <button className="tool-button clear" onClick={clearCanvas}>
            <Trash2 size={16} /> Clear
          </button>
          <button className="tool-button download" onClick={downloadCanvas}>
            <Save size={16} /> Save
          </button>
          <button className="tool-button home" onClick={() => navigate("/home")}>
            <Home size={16} /> Home
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} id="canvas" />
    </div>
  );
};

export default Whiteboard;