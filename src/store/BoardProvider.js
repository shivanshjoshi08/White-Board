// src/store/BoardProvider.js

import React, { useCallback, useReducer, useState, useEffect } from "react";
import boardContext from "./board-context";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import {
  createElement,
  getSvgPathFromStroke,
  isPointNearElement,
} from "../utils/element";
import getStroke from "perfect-freehand";
import axios from "axios";

// ... boardReducer (No changes needed here)
const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL:
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    case BOARD_ACTIONS.CHANGE_ACTION_TYPE:
      return {
        ...state,
        toolActionType: action.payload.actionType,
      };
    case BOARD_ACTIONS.DRAW_DOWN:
      const { clientX, clientY, stroke, fill, size } = action.payload;
      const newElement = createElement(
        state.elements.length,
        clientX,
        clientY,
        clientX,
        clientY,
        { type: state.activeToolItem, stroke, fill, size }
      );
      return {
        ...state,
        toolActionType:
          state.activeToolItem === TOOL_ITEMS.TEXT
            ? TOOL_ACTION_TYPES.WRITING
            : TOOL_ACTION_TYPES.DRAWING,
        elements: [...state.elements, newElement],
      };
    case BOARD_ACTIONS.DRAW_MOVE:
      const { clientX: moveX, clientY: moveY } = action.payload;
      const newElements = [...state.elements];
      const index = state.elements.length - 1;
      const { type } = newElements[index];
      switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          const { x1, y1, stroke, fill, size } = newElements[index];
          const updatedElement = createElement(index, x1, y1, moveX, moveY, {
            type: state.activeToolItem,
            stroke,
            fill,
            size,
          });
          newElements[index] = updatedElement;
          return {
            ...state,
            elements: newElements,
          };
        case TOOL_ITEMS.BRUSH:
          newElements[index].points = [
            ...newElements[index].points,
            { x: moveX, y: moveY },
          ];
          newElements[index].path = new Path2D(
            getSvgPathFromStroke(getStroke(newElements[index].points))
          );
          return {
            ...state,
            elements: newElements,
          };
        default:
          throw new Error("Type not recognized");
      }
    case BOARD_ACTIONS.DRAW_UP:
      const elementsCopy = [...state.elements];
      const newHistory = [
        ...state.history.slice(0, state.index + 1),
        elementsCopy,
      ];
      return {
        ...state,
        history: newHistory,
        index: state.index + 1,
      };
    case BOARD_ACTIONS.ERASE:
      const { clientX: eraseX, clientY: eraseY } = action.payload;
      const erasedElements = state.elements.filter((element) =>
        !isPointNearElement(element, eraseX, eraseY)
      );
      return {
        ...state,
        elements: erasedElements,
      };
    case BOARD_ACTIONS.CHANGE_TEXT:
      const textIndex = state.elements.length - 1;
      const updatedElements = [...state.elements];
      updatedElements[textIndex].text = action.payload.text;
      const updatedHistory = [
        ...state.history.slice(0, state.index + 1),
        updatedElements,
      ];
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
        elements: updatedElements,
        history: updatedHistory,
        index: state.index + 1,
      };
    case BOARD_ACTIONS.REDO:
      if (state.index >= state.history.length - 1) return state;
      return {
        ...state,
        elements: [...state.history[state.index + 1]],
        index: state.index + 1,
      };
    case BOARD_ACTIONS.UNDO:
      if (state.index <= 0) return state;
      return {
        ...state,
        elements: [...state.history[state.index - 1]],
        index: state.index - 1,
      };
    case BOARD_ACTIONS.CLEAR_CANVAS:
      return {
        ...state,
        elements: [],
        history: [[]],
        index: 0,
      };
    default:
      return state;
  }
};

// ... initialBoardState
const initialBoardState = {
  activeToolItem: TOOL_ITEMS.BRUSH,
  toolActionType: TOOL_ACTION_TYPES.NONE,
  elements: [],
  history: [[]],
  index: 0,
};

const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState
  );
  const [drawings, setDrawings] = useState([]);

  const fetchDrawings = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/drawings`);
      setDrawings(response.data);
    } catch (error) {
      console.error("Error fetching drawings:", error);
    }
  }, []);

  useEffect(() => {
    fetchDrawings();
  }, [fetchDrawings]);

  // ... all other handler functions

  const handleSaveDrawing = useCallback(async () => {
    try {
      const canvas = document.getElementById("canvas");
      if (!canvas) return;
      const imageData = canvas.toDataURL("image/png");
      await axios.post(`${process.env.REACT_APP_API_URL}/api/drawings`, {
        drawingData: imageData,
      });
      alert("Drawing saved!");
      fetchDrawings();
    } catch (error) {
      alert("Failed to save drawing.");
    }
  }, [fetchDrawings]);

  // NEW: Drawing ko delete karne ke liye function
  const handleDeleteDrawing = useCallback(async (drawingId) => {
    // User se confirm karein
    const userConfirmed = window.confirm("Are you sure you want to delete this drawing?");
    if (!userConfirmed) {
        return;
    }

    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/drawings/${drawingId}`);
        alert('Drawing deleted successfully!');
        // UI ko update karne ke liye list ko re-fetch karein
        fetchDrawings();
    } catch (error) {
        alert('Failed to delete drawing.');
    }
  }, [fetchDrawings]);

  const changeToolItemClick = (tool) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: {
        tool,
      },
    });
  };

  const boardMouseDownHandler = (event, toolboxState) => {
    const { clientX, clientY } = event;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTION_TYPES.ERASING,
        },
      });
      return;
    }
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activeToolItem]?.stroke,
        fill: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,
      },
    });
  };

  const boardMouseMoveHandler = (event) => {
    const { clientX, clientY } = event;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_MOVE,
        payload: {
          clientX,
          clientY,
        },
      });
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };

  const boardMouseUpHandler = () => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_UP,
    });
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTION_TYPES.NONE,
      },
    });
  };

  const textAreaBlurHandler = (text) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: {
        text,
      },
    });
  };

  const boardRedoHandler = useCallback(() => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.REDO,
    });
  }, []);

  const boardUndoHandler = useCallback(() => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.UNDO,
    });
  }, []);

  const handleDownload = useCallback(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const data = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "board.png";
    anchor.click();
  }, []);
  
  const handleClearCanvas = useCallback(() => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CLEAR_CANVAS,
    });
  }, []);

  const handleLoadDrawing = useCallback((imageData) => {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = imageData;
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
    };
    dispatchBoardAction({ type: BOARD_ACTIONS.CLEAR_CANVAS });
    alert("Drawing loaded onto canvas!");
  }, []);

  const boardContextValue = {
    // ... all other context values
    activeToolItem: boardState.activeToolItem,
    elements: boardState.elements,
    toolActionType: boardState.toolActionType,
    drawings,
    changeToolItemClick,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo: boardUndoHandler,
    redo: boardRedoHandler,
    handleDownload,
    handleSaveDrawing,
    handleClearCanvas,
    handleLoadDrawing,
    handleDeleteDrawing, // NEW: Add the delete function to the context
  };

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;