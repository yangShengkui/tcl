/*! Rappid v1.7.1 - HTML5 Diagramming Framework

Copyright (c) 2015 client IO

 2016-03-03 


This Source Code Form is subject to the terms of the Rappid License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


var inputs = {

    'bpmn.Gateway': {
        icon: {
            type: 'select',
            options: [
                { value: 'none', content: '默认' },
                { value: 'cross', content: '排除' },
                { value: 'circle', content: '包含' },
                { value: 'plus', content: '平行' }
            ],
            label: 'Type',
            group: 'general',
            index: 2
        },
        attrs: {
            '.label/text': {
                type: 'text',
                label: '名称',
                group: 'general',
                index: 1
            },
            '.body/fill': {
                type: 'color',
                label: '主体颜色 ',
                group: '外观',
                index: 1
            }
        }
    },

    'bpmn.Activity': {
        content: {
            type: 'textarea',
            label: '内容',
            group: 'general',
            index: 1
        },
        icon: {
            type: 'select',
            options: ['无','信息','用户'],
            label: '图标',
            group: 'general',
            index: 2
        },
        activityType: {
            type: 'select',
            options: ['任务', '变换', '二级任务', '激活'],
            label: '类型',
            group: 'general',
            index: 3
        },
        subProcess: {
            type: 'toggle',
            label: '二级步骤',
            group: 'general',
            index: 4
        },
        attrs: {
            '.body/fill': {
                type: 'color',
                label: '主体颜色',
                group: '外观',
                index: 1
            }
        }
    },

    'bpmn.Event': {
        eventType: {
            type: 'select',
            options: ['开始','结束','中间'],
            group: 'general',
            label: '类型',
            index: 2
        },
        icon: {
            type: 'select',
            options: [
                { value: 'none', content: '无' },
                { value: 'cross', content: '取消' },
                { value: 'message', content: '信息' },
                { value: 'plus', content: '平行事件' }
            ],
            label: '子类型',
            group: 'general',
            index: 3
        },
        attrs: {
            '.label/text': {
                type: 'text',
                label: '名称',
                group: 'general',
                index: 1
            },
            '.body/fill': {
                type: 'color',
                label: '主体颜色',
                group: '外观',
                index: 1
            }
        }
    },

    'bpmn.Annotation': {
        content: {
            type: 'textarea',
            label: 'Content',
            group: 'general',
            index: 1
        },
        attrs: {
            '.body/fill': {
                type: 'color',
                label: '主体颜色',
                group: '外观',
                index: 1
            },
            '.body/fill-opacity': {
                type: 'range',
                min: 0,
                max: 1,
                step: 0.1,
                label: '透明度',
                group: '外观',
                index: 2
            }

        }
    },

    'bpmn.Pool': {
        lanes: {
            type: 'object',
            group: 'general',
            index: 1,
            attrs: {
                label: {
                    style: 'display:none;'
                }
            },
            properties: {
                label: {
                    type: 'text',
                    label: '标签'
                },
                sublanes: {
                    type: 'list',
                    label: '增加连线',
                    item: {
                        type: 'object',
                        properties: {
                            label: {
                                type: 'text',
                                label: '标签',
                                attrs: {
                                    label: {
                                        style: 'display:none;'
                                    }
                                }
                            },
                            sublanes: {
                                type: 'list',
                                label: '增加子连线',
                                item: {
                                    type: 'object',
                                    properties: {
                                        label: {
                                            type: 'text',
                                            label: '标签',
                                            attrs: {
                                                label: {
                                                    style: 'display:none;'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        attrs: {
            '.body/fill': {
                type: 'color',
                label: '主体颜色',
                group: '外观',
                index: 1
            },
            '.header/fill': {
                type: 'color',
                label: '标题颜色',
                group: '外观',
                index: 2
            },
            '.lane-body/fill': {
                type: 'color',
                label: '线框颜色',
                group: '外观',
                index: 3
            },
            '.lane-header/fill': {
                type: 'color',
                label: '线框标题颜色',
                group: '外观',
                index: 4
            }
        }
    },

    'bpmn.Group': {
        attrs: {
            '.label/text': {
                type: 'text',
                label: '名称',
                group: 'general',
                index: 1
            },
            '.label-rect/fill': {
                type: 'color',
                label: '主体颜色',
                group: '外观',
                index: 1
            }
        }
    },

    'bpmn.Conversation': {
        conversationType: {
            type: 'select',
            options: ['conversation', 'call-conversation'],
            label: 'Type',
            group: 'general',
            index: 2
        },
        subProcess: {
            type: 'toggle',
            label: '子步骤',
            group: 'general',
            index: 3
        },
        attrs: {
            '.label/text': {
                type: 'text',
                label: '名称',
                group: 'general',
                index: 1
            },
            '.body/fill': {
                type: 'color',
                label: '主体颜色',
                group: '外观',
                index: 1
            }
        }
    },

    'bpmn.Choreography': {
        participants: {
            type: 'list',
            label: '参与者',
            item: {
                type: 'text'
            },
            group: 'general',
            index: 1
        },
        initiatingParticipant: {
            type: 'select',
            label: '初始化参与者',
            options: 'participants',
            group: 'general',
            index: 2
        },
        subProcess: {
            type: 'toggle',
            label: '次要步骤',
            group: 'general',
            index: 3
        },
        content: {
            type: 'textarea',
            label: '内容',
            group: 'general',
            index: 4
        },
        attrs: {
            '.body/fill': {
                type: 'color',
                label: '主要颜色',
                group: '外观',
                index: 1
            },
            '.participant-rect/fill': {
                type: 'color',
                label: '次要颜色',
                group: '外观',
                index: 2
            }
        }
    },

    'bpmn.DataObject': {
        attrs: {
            '.label/text': {
                type: 'text',
                label: '名称',
                group: 'general',
                index: 1
            },
            '.body/fill': {
                type: 'color',
                label: '主体颜色',
                group: '外观',
                index: 1
            }
        }
    },

    'bpmn.Message': {
        attrs: {
            '.label/text': {
                type: 'text',
                label: '名称',
                group: 'general',
                index: 1
            },
            '.body/fill': {
                type: 'color',
                label: '主体颜色',
                group: '外观',
                index: 1
            }
        }
    },

    'bpmn.Flow': {
        flowType: {
            type: 'select',
            options: ['默认', '条件','正常','消息','联合','对话'],
            label: '类型',
            group: 'general',
            index: 1
        }
    }
};
