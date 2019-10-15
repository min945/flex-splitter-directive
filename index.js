"use strict";
addEventListener('pointerdown', function (pointerDownEvent) {
    var separator = pointerDownEvent.target;
    var container = separator.parentElement;
    if (!container || !pointerDownEvent.isPrimary || pointerDownEvent.button !== 0 || separator.getAttribute('role') !== 'separator') {
        return;
    }
    var vertical = container.hasAttribute('data-vertical-splitter');
    var horizontal = container.hasAttribute('data-horizontal-splitter');
    if (!vertical && !horizontal) {
        return;
    }
    var pointerId = pointerDownEvent.pointerId;
    var pane1 = separator.previousElementSibling;
    var pane2 = separator.nextElementSibling;
    var pane1Style = getComputedStyle(pane1);
    var pane2Style = getComputedStyle(pane2);
    var pane1Rect = pane1.getBoundingClientRect();
    var onPointerMove;
    if (vertical) {
        var pane1Pos_1 = pane1Rect.top;
        var totalSize_1 = pane1.offsetHeight + pane2.offsetHeight;
        var pane1MinSize_1 = Math.max(parseInt(pane1Style.minHeight, 10) || 0, totalSize_1 - (parseInt(pane2Style.maxHeight, 10) || totalSize_1));
        var pane1MaxSize_1 = Math.min(parseInt(pane1Style.maxHeight, 10) || totalSize_1, totalSize_1 - (parseInt(pane2Style.minHeight, 10) || 0));
        onPointerMove = function (event) {
            if (event.pointerId === pointerId) {
                var pane1Size = Math.min(Math.max(event.clientY - pane1Pos_1, pane1MinSize_1), pane1MaxSize_1);
                pane1.style.height = pane1Size + 'px';
                pane2.style.height = totalSize_1 - pane1Size + 'px';
            }
        };
    }
    else {
        var pane1Pos_2 = pane1Rect.left;
        var totalSize_2 = pane1.offsetWidth + pane2.offsetWidth;
        var pane1MinSize_2 = Math.max(parseInt(pane1Style.minWidth, 10) || 0, totalSize_2 - (parseInt(pane2Style.maxWidth, 10) || totalSize_2));
        var pane1MaxSize_2 = Math.min(parseInt(pane1Style.maxWidth, 10) || totalSize_2, totalSize_2 - (parseInt(pane2Style.minWidth, 10) || 0));
        onPointerMove = function (event) {
            if (event.pointerId === pointerId) {
                var pane1Size = Math.min(Math.max(event.clientX - pane1Pos_2, pane1MinSize_2), pane1MaxSize_2);
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
        }
    };
    separator.addEventListener('pointercancel', onPointerUp);
    separator.addEventListener('pointerup', onPointerUp);
    separator.addEventListener('pointermove', onPointerMove);
    separator.setPointerCapture(pointerId);
});
