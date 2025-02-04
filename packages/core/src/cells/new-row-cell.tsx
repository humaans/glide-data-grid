import { getMiddleCenterBias } from "../internal/data-grid/render/data-grid-lib.js";
import { InnerGridCellKind, type NewRowCell } from "../internal/data-grid/data-grid-types.js";
import type { BaseDrawArgs, InternalCellRenderer } from "./cell-types.js";

export const newRowCellRenderer: InternalCellRenderer<NewRowCell> = {
    getAccessibilityString: () => "",
    kind: InnerGridCellKind.NewRow,
    needsHover: true,
    needsHoverPosition: false,
    measure: () => 200,
    draw: a => drawNewRowCell(a, a.cell.hint, a.cell.icon),
    onPaste: () => undefined,
};

function drawNewRowCell(args: BaseDrawArgs, data: string, icon?: string) {
    // Code in this fn has been changed by Humaans for better rendering of the new row for our use case
    const { ctx, rect, hoverAmount, theme, spriteManager } = args;
    const { x, y, width: w, height: h } = rect;
    ctx.beginPath();
    ctx.globalAlpha = hoverAmount;
    ctx.rect(x, y, w, h);
    ctx.fillStyle = theme.bgHeaderHovered;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();

    const alwaysShowIcon = data !== "";

    let textX = 0;

    if (icon !== undefined) {
        const padding = 8;
        const size = 20;
        const xOffset = 1;
        const px = x + padding + xOffset;
        const py = y + padding - 1;

        spriteManager.drawSprite(icon, "normal", ctx, px, py, size, theme, alwaysShowIcon ? 1 : hoverAmount);
        textX = size + padding + xOffset;
    } else {
        textX = 24;
        const finalLineSize = 12;
        const lineSize = alwaysShowIcon ? finalLineSize : hoverAmount * finalLineSize;
        const xTranslate = alwaysShowIcon ? 0 : (1 - hoverAmount) * finalLineSize * 0.5;

        const padPlus = theme.cellHorizontalPadding + 4;
        if (lineSize > 0) {
            ctx.moveTo(x + padPlus + xTranslate, y + h / 2);
            ctx.lineTo(x + padPlus + xTranslate + lineSize, y + h / 2);
            ctx.moveTo(x + padPlus + xTranslate + lineSize * 0.5, y + h / 2 - lineSize * 0.5);
            ctx.lineTo(x + padPlus + xTranslate + lineSize * 0.5, y + h / 2 + lineSize * 0.5);
            ctx.lineWidth = 2;
            ctx.strokeStyle = theme.bgIconHeader;
            ctx.lineCap = "round";
            ctx.stroke();
        }
    }

    const font = `12px ${theme.fontFamily}`;
    ctx.font = font;
    ctx.fillStyle = theme.textMedium;
    ctx.fillText(data, textX + x + theme.cellHorizontalPadding + 0.5, y + h / 2 + getMiddleCenterBias(ctx, font));
    ctx.beginPath();
}
