import { SourceNode, CameraObject, Absolute3DPosition, SourceNodeOptions } from "@openhps/core";
import { XRDataFrame } from "../../data/XRDataFrame";
import { WebXRService } from "../../service/WebXRService";

export class XRSource extends SourceNode<XRDataFrame> {
    private _refSpace: XRReferenceSpace = null;
    private _service: WebXRService = null;

    constructor(options?: SourceNodeOptions) {
        super(options);
        this.options.source = this.options.source || new CameraObject(this.uid);

        this.on('build', this._initReferenceSpace.bind(this));
        this.once('destroy', this._onDestroy.bind(this));
    }

    private _initReferenceSpace(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._service = this.model.findService<WebXRService>("WebXRService");
            if (this._service === undefined || this._service === null) {
                return reject(new Error(`WebXR service was not added to model!`));
            }

            // Request local reference spaces at the time this session was created
            this._service.session.requestReferenceSpace('local').then((refSpace: XRReferenceSpace) => {
                this.logger('debug', {
                    message: "Local reference space created. Starting animation frames ..."
                });
                this._refSpace = refSpace;

                this._service.session.requestAnimationFrame(this._onXRFrame.bind(this));
            });

            resolve();
        });
    }

    private _onDestroy(): Promise<void> {
        return new Promise((resolve) => {
            this._service.session.end();
            resolve();
        });
    }

    private _onXRFrame(time: number, frame: XRFrame): void {
        const pose: XRViewerPose = frame.getViewerPose(this._refSpace);

        if (pose) {
            this._service.gl.bindFramebuffer(this._service.gl.FRAMEBUFFER, frame.session.renderState.baseLayer.framebuffer);
            
            const matrix: Float32Array = pose.transform.matrix;
            const xrPosition: DOMPointReadOnly = pose.transform.position;
            
            // Set DOMPoint position to camera source
            const position: Absolute3DPosition = new Absolute3DPosition(xrPosition.x, xrPosition.y, xrPosition.z);
            // TODO: Handle accuracy based on the emulated position
            position.accuracy = pose.emulatedPosition ? 100 : 0;
            this.source.position = position;

            // Create XR Data Frame
            const dataFrame = new XRDataFrame(); 
            dataFrame.createdTimestamp = time; // Creation timestamp based on the XR frame
            dataFrame.viewerPose = matrix;
            dataFrame.rawFrame = frame;
            dataFrame.source = this.source;
            dataFrame.refSpace = this._refSpace;

            this.push(dataFrame).then(() => {
                frame.session.requestAnimationFrame(this._onXRFrame.bind(this));
            });
        } else {
            // No viewer pose detected, request new animation frame
            frame.session.requestAnimationFrame(this._onXRFrame.bind(this));
        }
    }

    public onPull(): Promise<XRDataFrame> {
        return new Promise<XRDataFrame>((resolve) => {
            if (this._service.session !== null) {
                this._service.session.requestAnimationFrame(this._onXRFrame.bind(this));
            }
            resolve(undefined);
        });
    }

}
