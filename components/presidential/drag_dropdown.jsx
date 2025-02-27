import React, { useRef, useState, useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function _swiperDropdown({ options: _options, optionSelected, classes }) {
    const optionElements = [];

    const element = useRef(null);
    const dragYStart = useRef();

    const [ options, setOptions ] = useState(_options);
    const [ activeItemIndex, setActiveItemIndex] = useState(0);
    const [ activeClassName, setActiveClassName ] = useState(classes.active);
    const [ childClassName, setChildClassName ] = useState(classes.child);
    const [ dragYOffset, setDragYOffset ] = useState(0);
    const [ yOffset, setYOffset ] = useState(0);
    const [ widthOverride, setWidthOverride ] = useState(null);

    useIsomorphicLayoutEffect(() => {
        const { current: _element } = element;

        if (widthOverride) {
            _element.style.width = `${widthOverride}px`;
        }

        else {
            const selectedItem = _element.children[activeItemIndex];
            _element.style.width = `${selectedItem.getBoundingClientRect().width}px`;
        }
    }, [ activeItemIndex, widthOverride ])

    useEffect(() => {
        setActiveClassName(classes.active);
    }, [ classes.active ])

    const moveToElement = (event, index) => {
        const itemHeight = event.target.getBoundingClientRect().height;
        const newYOffset = -(itemHeight * index);
        setYOffset(newYOffset);
    };

    const selectOption = (index, value) => {
        if (index !== activeItemIndex) {
            setActiveItemIndex(index);
            setWidthOverride(null);

            if (optionSelected) {
                optionSelected(index, value);
            }
        }
    }

    const dragStart = (event) => {
        const blankImage = new Image();
        blankImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

        event.dataTransfer.setDragImage(blankImage, 0, 0);
        event.target.classList.add("drag-dropdown-dragging");

        dragYStart.current = event.pageY;
    };

    const drag = (event) => {
        if (event.pageY) {
            const dragYOffset = event.pageY - dragYStart.current;

            const userYOffset = yOffset + dragYOffset;
            const itemHeight = event.target.getBoundingClientRect().height;

            const previousItemIndex = Math.max(
                Math.min(
                    -Math.ceil(userYOffset / itemHeight),
                    options.length - 1
                ),
                0
            );
            const nextItemIndex = Math.max(
                Math.min(
                    previousItemIndex - 1,
                    options.length - 1
                ),
                0
            );

            setDragYOffset(dragYOffset);

            const optionElements = event.target.children;
            let widthOverride = 0;

            if (previousItemIndex > 0 && optionElements[previousItemIndex]) {
                widthOverride = optionElements[previousItemIndex].getBoundingClientRect().width;
            }

            if (previousItemIndex <= optionElements.length && optionElements[nextItemIndex]) {
                widthOverride = Math.max(widthOverride, optionElements[nextItemIndex].getBoundingClientRect().width);
            }

            if (widthOverride !== 0) {
                setWidthOverride(widthOverride);
            }

            else {
                setWidthOverride(null);
            }
        }        
    };
    
    const dragEnd = (event) => {
        const userYOffset = yOffset + dragYOffset;
        const optionHeight = event.target.getBoundingClientRect().height;
        const roundedIndex = Math.round(userYOffset / optionHeight);

        let realIndex = roundedIndex;
        if (realIndex > 0) {
            realIndex = 0;
        }

        const maxIndex = -(options.length - 1);
        if (realIndex < maxIndex) {
            realIndex = maxIndex;
        }

        setYOffset(realIndex * optionHeight);
        setDragYOffset(0);
        setWidthOverride(null);

        const index = Math.min(
            Math.abs(
                Math.floor(realIndex)
            ),
            options.length
        );

        const value = event.target.children[index]?.getAttribute('value');
        if (value) {
            selectOption(index, value);
        }

        event.target.classList.remove("drag-dropdown-dragging");
    };

    const dragOver = (event) => {
        event.dataTransfer.dropEffect = "copy";
        event.preventDefault();
    };

    for (let i = 0; i < options.length; i++) {
        const { display, value } = options[i];
        const classes = [ "drag-dropdown-item" ];

        if (childClassName) {
            classes.push(childClassName);   
        }

        if (i == activeItemIndex) {
            classes.push("drag-dropdown-active");

            if (activeClassName) {
                classes.push(activeClassName);
            }
        }

        const click = (event) => {
            event.preventDefault();
    
            moveToElement(event, i);
            selectOption(i, value);
        }

        optionElements.push(
            <li 
                className={ classes.join(' ') }
                value= { value }
                key={ value }
                onClick={ click }
            >
                { display ?? value }
            </li>
        );
    }

    return (
        <ul
            draggable="true"
            className="drag-dropdown"
            onDragStart={ dragStart }
            onDrag={ drag }
            onDragEnd={ dragEnd }
            onDragOver={ dragOver }
            ref={ element }
            style={{ transform: `translate(0px, ${yOffset + dragYOffset}px)` }}
        >
            { optionElements }
        </ul>
    );
};