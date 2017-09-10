define(['jquery', 'jsPlumb'], function ($) {
    /**
     * Get a JsPlumbInstance for a container.
     * Call this if the container div is available in DOM via id
     * @param containerId
     * @constructor
     */
    function GetPlumbInstance(containerId) {
        return jsPlumb.getInstance({
            Connector: ['Straight', {}],
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            Anchors: ['Left', 'Right'],
            ConnectionOverlays: [
                ['Arrow', {
                    width: 15, length: 15, location: 1, id: 'arrow',
                    paintStyle: {
                        fillStyle: '#00CCCC',
                        outlineColor: 'blue',
                        outlineWidth: 0
                    }
                }]
            ],
            Container: $('#' + containerId)[0]

        });
    }
    return GetPlumbInstance;
});