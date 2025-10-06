import React, { useContext } from "react";
import classes from "./index.module.css";
import cx from "classnames";

import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaUndoAlt,
  FaRedoAlt,
  FaFont,
  FaDownload,
  FaSave,
  FaTrash, // NEW: Import the trash icon
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import boardContext from "../../store/board-context";
import { TOOL_ITEMS } from "../../constants";

const Toolbar = () => {
  const {
    // ...all your other functions from context
    activeToolItem,
    changeToolItemClick,
    undo,
    redo,
    handleDownload,
    handleSaveDrawing,
    handleClearCanvas, // NEW: Get the clear function from context
  } = useContext(boardContext);

  return (
    <div className={classes.container}>
      {/* ...all your other tool divs */}
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.BRUSH,
        })}
        onClick={() => changeToolItemClick(TOOL_ITEMS.BRUSH)}
        data-tooltip="Brush"
      >
        <FaPaintBrush />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.LINE,
        })}
        onClick={() => changeToolItemClick(TOOL_ITEMS.LINE)}
        data-tooltip="Line"
      >
        <FaSlash />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.RECTANGLE,
        })}
        onClick={() => changeToolItemClick(TOOL_ITEMS.RECTANGLE)}
        data-tooltip="Rectangle"
      >
        <LuRectangleHorizontal />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.CIRCLE,
        })}
        onClick={() => changeToolItemClick(TOOL_ITEMS.CIRCLE)}
        data-tooltip="Circle"
      >
        <FaRegCircle />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.ARROW,
        })}
        onClick={() => changeToolItemClick(TOOL_ITEMS.ARROW)}
        data-tooltip="Arrow"
      >
        <FaArrowRight />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.TEXT,
        })}
        onClick={() => changeToolItemClick(TOOL_ITEMS.TEXT)}
        data-tooltip="Text"
      >
        <FaFont />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.ERASER,
        })}
        onClick={() => changeToolItemClick(TOOL_ITEMS.ERASER)}
        data-tooltip="Eraser"
      >
        <FaEraser />
      </div>
      <div className={classes.toolItem} onClick={undo} data-tooltip="Undo">
        <FaUndoAlt />
      </div>
      <div className={classes.toolItem} onClick={redo} data-tooltip="Redo">
        <FaRedoAlt />
      </div>
      <div
        className={classes.toolItem}
        onClick={handleDownload}
        data-tooltip="Download"
      >
        <FaDownload />
      </div>
      <div
        className={classes.toolItem}
        onClick={handleSaveDrawing}
        data-tooltip="Save"
      >
        <FaSave />
      </div>

      {/* NEW: Add the Clear button div */}
      <div
        className={classes.toolItem}
        onClick={handleClearCanvas}
        data-tooltip="Clear All"
      >
        <FaTrash />
      </div>
    </div>
  );
};

export default Toolbar;