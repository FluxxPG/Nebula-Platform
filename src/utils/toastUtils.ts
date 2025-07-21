import { VariantType, SnackbarKey } from 'notistack';

let enqueueSnackbarRef:
    | ((msg: string, options?: { variant: VariantType }) => SnackbarKey)
    | null = null;

export const setEnqueueSnackbar = (
    enqueueSnackbar: (msg: string, options?: { variant: VariantType }) => SnackbarKey
) => {
    enqueueSnackbarRef = enqueueSnackbar;
};

export const showToast = (
    message: string,
    variant: VariantType = 'default'
): SnackbarKey | void => {
    if (enqueueSnackbarRef) {
        return enqueueSnackbarRef(message, { variant });
    } else {
        console.warn('Toast system not ready yet.');
    }
};
