import { DragAndDropToolInterface } from '../drag-and-drop-tool-interface';
import { IContainer } from '../../../../../../../../model/IContainer';
import { SelectedElementService } from '../../../../../../side/modules/selected-element/services/selected-element.service';
import { DraggableElementBase } from '../../../graphical-editor/elements/draggable-element-base';
import { MultiselectionService } from '../../services/multiselection.service';
import { Point } from '../../../graphical-editor/util/area';
import { KeyboardToolInterface } from '../keyboard-tool-interface';
import { ToolBase } from '../tool-base';
import { Key } from '../../../../../../../../util/keycode';

export class SelectTool extends ToolBase implements KeyboardToolInterface, DragAndDropToolInterface {
    public icon = 'mouse-pointer';
    public color = 'primary';
    public cursor = 'default';
    public name = 'tools.select';
    public selectedElements: any[] = [];
    public done = false;

    public activate() {
        this.selectedElements = [];
    }

    public deactivate() {
        this.selectedElements = [];
    }

    public click(event: MouseEvent, zoom: number): Promise<void> {
        return Promise.resolve();
    }

    private toggleSelection(element: IContainer): void {
        let ind = this.selectedElements.indexOf(element);
        if (ind > -1) {
            this.selectedElements.splice(ind, 1);
        } else {
            this.selectedElements.push(element);
        }
        this.selectedElementService.toggleSelection([element]);
    }

    private setSelection(element: IContainer): void {
        this.selectedElements = [element];
        this.selectedElementService.selectedElements = this.selectedElements;
    }

    public select(element: IContainer, evt: MouseEvent): Promise<void> {
        if (evt.shiftKey) {
            this.toggleSelection(element);
        } else {
            if (this.selectedElementService.isSelected(element)) {
                return Promise.resolve();
            }
            this.setSelection(element);
        }

        let blur = (<HTMLElement>document.activeElement).blur;
        if (blur) {
            (<HTMLElement>document.activeElement).blur();
        }
        return Promise.resolve();
    }

    private rawPosition: Point;
    private relativePosition: Point;
    private getMousePosition(evt: MouseEvent, zoom: number): Point {
        let deltaX = (evt.screenX - this.rawPosition.x) / zoom;
        let deltaY = (evt.screenY - this.rawPosition.y) / zoom;
        let xScaled = (this.relativePosition.x + deltaX);
        let yScaled = (this.relativePosition.y + deltaY);

        return {
            x: Math.round(xScaled),
            y: Math.round(yScaled)
        };
    }

    private isShiftRect = false;
    public mouseDown(event: MouseEvent, zoom: number): Promise<void> {
        if (event.shiftKey) {
            this.isShiftRect = true;
        }
        this.rawPosition = {
            x: event.screenX,
            y: event.screenY
        };

        this.relativePosition = {
            x: event.offsetX,
            y: event.offsetY
        };

        this.rect.mouseDown(this.getMousePosition(event, zoom));
        return Promise.resolve();
    }

    public mouseDrag(event: MouseEvent, zoom: number): Promise<void> {
        this.rect.mouseMove(this.getMousePosition(event, zoom));
        return Promise.resolve();
    }

    public mouseUp(event: MouseEvent, zoom: number): Promise<void> {
        let isShift = this.isShiftRect;
        this.isShiftRect = false;
        return this.rect.mouseUp(this.getMousePosition(event, zoom), isShift);
    }

    public keydown(evt: KeyboardEvent): Promise<void> {
        let ctrl = evt.ctrlKey || evt.metaKey;

        if (ctrl && evt.key === 'c') {
            // Copy
            console.log('Copy');
            // copySelection();
        }

        if (ctrl && evt.key === 'v') {
            // Paste
            console.log('Paste');
            // pasteSelection();
        }

        if (ctrl && evt.key === 'x') {
            // Cut
            console.log('Cut');
            // cutSelection();
        }

        if (evt.key === Key.BACKSPACE) {
            // Delete
            console.log('Delete');
            // deleteSelection();
        }
        return Promise.resolve();
    }

    constructor(protected selectedElementService: SelectedElementService, private rect: MultiselectionService) {
        super(selectedElementService);
    }
}
