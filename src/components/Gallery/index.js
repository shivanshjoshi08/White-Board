// src/components/Gallery/index.js

import React, { useContext } from 'react';
import classes from './index.module.css';
import boardContext from '../../store/board-context';
import { FaTrash } from 'react-icons/fa'; // NEW: Trash icon ko import karein

const Gallery = () => {
    // NEW: handleDeleteDrawing ko context se lein
    const { drawings, handleLoadDrawing, handleDeleteDrawing } = useContext(boardContext);

    const handleDeleteClick = (e, drawingId) => {
        e.stopPropagation(); // Yeh zaroori hai taaki image load na ho jaye
        handleDeleteDrawing(drawingId);
    };

    if (!drawings || drawings.length === 0) {
        return (
            <div className={classes.galleryContainer}>
                <h3>My Saved Drawings</h3>
                <p>No saved drawings yet.</p>
            </div>
        );
    }

    return (
        <div className={classes.galleryContainer}>
            <h3>My Saved Drawings</h3>
            <div className={classes.imagesGrid}>
                {drawings.map(drawing => (
                    <div 
                        key={drawing._id} 
                        className={classes.imageWrapper}
                        onClick={() => handleLoadDrawing(drawing.drawingData)}
                    >
                        <img 
                            src={drawing.drawingData} 
                            alt="Saved drawing" 
                            className={classes.thumbnail}
                        />
                        {/* NEW: Delete icon/button add karein */}
                        <div 
                            className={classes.deleteIcon} 
                            onClick={(e) => handleDeleteClick(e, drawing._id)}
                        >
                            <FaTrash />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;