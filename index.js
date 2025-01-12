"use strict";
addEventListener('pointerdown', function (pointerDownEvent) {
    var _a;
    var separator = pointerDownEvent.target;
    var container = separator.parentElement;
    if (!container || !pointerDownEvent.isPrimary || pointerDownEvent.button !== 0 || separator.getAttribute('role') !== 'separator') {
        return;
    }
    var vertical = container.hasAttribute('data-flex-splitter-vertical');
    var horizontal = container.hasAttribute('data-flex-splitter-horizontal');
    if (!vertical && !horizontal) {
        return;
    }
    // prevent text selection
    pointerDownEvent.preventDefault();
    var getElementSibling = function (element, direction) {
        // skip <template> elements
        while ((element = element[direction + 'ElementSibling']) && element.tagName === "TEMPLATE") { }
        return element;
    };
    (function () {
        // save styles for multiple children with "flex: auto" or "flex-grow: 1" style
        var child = container.firstElementChild;
        var protectedStyleNames = [horizontal ? 'width' : 'height', 'flex', 'flexGrow', 'flexShrink', 'flexBasis'];
        var _loop_1 = function () {
            if (child.getAttribute('role') !== 'separator') {
                var __flexSplitterStyle_1 = {};
                var computedStyle_1 = getComputedStyle(child);
                protectedStyleNames.forEach(function (name) { __flexSplitterStyle_1[name] = child.style[name]; });
                protectedStyleNames.forEach(function (name) { child.style[name] = name.startsWith('flex') ? '' : computedStyle_1[name]; });
                child.__flexSplitterStyle = __flexSplitterStyle_1;
            }
            child = getElementSibling(child, 'next');
        };
        while (child) {
            _loop_1();
        }
    })();
    var pointerId = pointerDownEvent.pointerId;
    var pane1 = getElementSibling(separator, 'previous');
    var pane2 = getElementSibling(separator, 'next');
    var containerStyle = getComputedStyle(container);
    if ((containerStyle.flexDirection.indexOf('reverse') !== -1 ? -1 : 1) * (horizontal && containerStyle.direction === 'rtl' ? -1 : 1) === -1) {
        _a = [pane2, pane1], pane1 = _a[0], pane2 = _a[1];
    }
    var pane1ComputedStyle = getComputedStyle(pane1);
    var pane2ComputedStyle = getComputedStyle(pane2);
    var pane1Rect = pane1.getBoundingClientRect();
    var onPointerMove;
    if (vertical) {
        var pane1Pos_1 = pane1Rect.top + pointerDownEvent.offsetY;
        var totalSize_1 = pane1.offsetHeight + pane2.offsetHeight;
        var pane1MinSize_1 = Math.max(parseInt(pane1ComputedStyle.minHeight, 10) || 0, totalSize_1 - (parseInt(pane2ComputedStyle.maxHeight, 10) || totalSize_1));
        var pane1MaxSize_1 = Math.min(parseInt(pane1ComputedStyle.maxHeight, 10) || totalSize_1, totalSize_1 - (parseInt(pane2ComputedStyle.minHeight, 10) || 0));
        onPointerMove = function (event) {
            if (event.pointerId === pointerId) {
                var pane1Size = Math.round(Math.min(Math.max(event.clientY - pane1Pos_1, pane1MinSize_1), pane1MaxSize_1));
                pane1.style.height = pane1Size + 'px';
                pane2.style.height = totalSize_1 - pane1Size + 'px';
            }
        };
    }
    else {
        var pane1Pos_2 = pane1Rect.left + pointerDownEvent.offsetX;
        var totalSize_2 = pane1.offsetWidth + pane2.clientWidth;
        var pane1MinSize_2 = Math.max(parseInt(pane1ComputedStyle.minWidth, 10) || 0, totalSize_2 - (parseInt(pane2ComputedStyle.maxWidth, 10) || totalSize_2));
        var pane1MaxSize_2 = Math.min(parseInt(pane1ComputedStyle.maxWidth, 10) || totalSize_2, totalSize_2 - (parseInt(pane2ComputedStyle.minWidth, 10) || 0));
        onPointerMove = function (event) {
            if (event.pointerId === pointerId) {
                var pane1Size = Math.round(Math.min(Math.max(event.clientX - pane1Pos_2, pane1MinSize_2), pane1MaxSize_2));
                pane1.style.width = pane1Size + 'px';
                pane2.style.width = totalSize_2 - pane1Size + 'px';
            }
        };
    }
    var onPointerUp = function (event) {
        if (event.pointerId === pointerId) {
            separator.releasePointerCapture(pointerId);
            separator.removeEventListener('pointermove', onPointerMove);
            separator.removeEventListener('pointerup', onPointerUp);
            separator.removeEventListener('pointercancel', onPointerUp);
            (function () {
                // restore styles except width | height
                var child = container.firstElementChild;
                var _loop_2 = function () {
                    var __flexSplitterStyle = child.__flexSplitterStyle;
                    if (__flexSplitterStyle) {
                        ;
                        (__flexSplitterStyle.flex ? ['flex'] : ['flexGrow', 'flexShrink', 'flexBasis']).forEach(function (name) { child.style[name] = __flexSplitterStyle[name]; });
                        delete child.__flexSplitterStyle;
                    }
                    child = getElementSibling(child, 'next');
                };
                while (child) {
                    _loop_2();
                }
            })();
        }
    };
    onPointerMove(pointerDownEvent);
    pane1.style.flexShrink = pane2.style.flexShrink = 1;
    separator.addEventListener('pointercancel', onPointerUp);
    separator.addEventListener('pointerup', onPointerUp);
    separator.addEventListener('pointermove', onPointerMove);
    separator.setPointerCapture(pointerId);
});
