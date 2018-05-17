/**
 * @file const
 * @author wangyisheng@baidu.com (wangyisheng)
 */

export const MIP_CONTAINER_ID = 'mip-router__app';
export const MIP_VIEW_ID = 'mip-router__view';
export const MIP_CONTENT_IGNORE_TAG_LIST = [
    'script',
    'mip-shell'
];
export const MIP_ERROR_ROUTE_PATH = '/mip-error';
export const DEFAULT_SHELL_CONFIG = {
    header: {
        title: '',
        logo: '',
        buttonGroup: []
    },
    view: {
        isIndex: false,
        transition: {
            mode: 'fade',
            effect: 'fade'
        }
    },
    footer: {}
};
