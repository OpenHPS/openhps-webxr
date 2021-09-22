import { DataFrame, SerializableObject, SerializableMember } from "@openhps/core";

@SerializableObject()
export class XRDataFrame extends DataFrame {
    refSpace: XRReferenceSpace;
    @SerializableMember()
    viewerPose: Float32Array;
    rawFrame: XRFrame;
    @SerializableMember()
    targetPose: Float32Array;
}
