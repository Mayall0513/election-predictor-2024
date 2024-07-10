import React, { useRef, useState, useEffect, useLayoutEffect } from "react";

export default function SwiperDropdown({ options, optionSelected, childClass, activeClass }) {
    const elements = [  ];

    const optionCount = useRef(options.length);
    const currentElement = useRef(null);
    const dragYStart = useRef();

    const [ activeItemIndex, setActiveItemIndex] = useState(0);
    const [ activeClassName, setActiveClassName ] = useState(activeClass);
    const [ childClassName, setChildClassName ] = useState(childClass);
    const [ dragYOffset, setDragYOffset ] = useState(0);
    const [ yOffset, setYOffset ] = useState(0);
    const [ widthOverride, setWidthOverride ] = useState(null);

    useLayoutEffect(() => {
        const element = currentElement.current;

        if (widthOverride) {
            element.style.width = `${widthOverride}px`;
        }

        else {
            const selectedItem = element.children[activeItemIndex];
            element.style.width = `${selectedItem.getBoundingClientRect().width}px`;
        }
    }, [activeItemIndex, widthOverride])

    useEffect(() => {
        setActiveClassName(activeClass);
    }, [activeClass])

    const moveToElement = (event, index) => {
        const itemHeight = event.target.getBoundingClientRect().height;
        const newYOffset = -(itemHeight * index);
        setYOffset(newYOffset);
    };

    const selectItem = (itemElements, index, value) => {
        if (activeClassName) {
            itemElements[activeItemIndex].classList.remove(activeClassName);
            itemElements[index].classList.add(activeClassName);
        }

        setActiveItemIndex(index);

        if (optionSelected) {
            optionSelected(index, value);
        }
    }

    const dragStart = (event) => {
        const blankImage = new Image();
        blankImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';        
        event.dataTransfer.setDragImage(blankImage, 0, 0);

        dragYStart.current = event.pageY;
        event.target.classList.add("swiper-dropdown-dragging");
    };

    const drag = (event) => {
        if (event.pageY) {
            const dragYOffset = event.pageY - dragYStart.current;

            const userYOffset = yOffset + dragYOffset;
            const itemHeight = event.target.getBoundingClientRect().height;
            const previousItemIndex = Math.max(
                Math.min(
                    -Math.floor(userYOffset / itemHeight),
                    optionCount.current - 1
                ),
                0
            );
            const nextItemIndex = Math.max(
                Math.min(
                    -Math.ceil(userYOffset / itemHeight),
                    optionCount.current - 1
                ),
                0
            );

            const itemElements = event.target.children;

            setDragYOffset(dragYOffset);
            setWidthOverride(
                Math.max(
                    itemElements[previousItemIndex].getBoundingClientRect().width,
                    itemElements[nextItemIndex].getBoundingClientRect().width
                )
            );
        }        
    };
    
    const dragEnd = (event) => {
        const userYOffset = yOffset + dragYOffset;
        const itemHeight = event.target.getBoundingClientRect().height;
        const roundedYOffset = itemHeight * Math.round(userYOffset / itemHeight);

        const maxOffset = -((optionCount.current - 1) * itemHeight);
        let realYOffset = roundedYOffset;

        if (realYOffset > 0) {
            realYOffset = 0;
        }

        if (realYOffset < maxOffset) {
            realYOffset = maxOffset;
        }

        setYOffset(realYOffset);
        setDragYOffset(0);
        setWidthOverride(null);

        const index = Math.min(
            Math.abs(Math.floor(realYOffset / itemHeight)),
            optionCount.current
        );

        const itemElements = event.target.children;
        const value = itemElements[index].getAttribute('value');
        selectItem(itemElements, index, value);

        event.target.classList.remove("swiper-dropdown-dragging");
    };

    const dragOver = (event) => {
        event.dataTransfer.dropEffect = "copy";
        event.preventDefault();
    };

    let i = 0;
    for (const { display, value } of options) {
        const itemIndex = i++;
        const classes = [ "swiper-dropdown-item" ];

        if (childClassName) {
            classes.push(childClassName);   
        }

        if (activeClassName && itemIndex == activeItemIndex) {
            classes.push(activeClassName);
        }

        const click = (event) => {
            event.preventDefault();
    
            moveToElement(event, itemIndex);
            selectItem(event.target.parentElement.children, itemIndex, value);
        }

        elements.push(
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
            className="swiper-dropdown"
            onDragStart={ dragStart }
            onDrag={ drag }
            onDragEnd={ dragEnd }
            onDragOver={ dragOver }
            ref={ currentElement }
            style={{ transform: `translate(0px, ${yOffset + dragYOffset}px)` }}
        >
            { elements }
        </ul>
    );
};