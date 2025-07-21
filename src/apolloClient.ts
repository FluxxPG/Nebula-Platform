import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NextLink, Operation } from '@apollo/client';
import configData from '../common_settings.json';
import { showToast } from './utils/toastUtils';
import Auth from './Auth';

const httpLink = new HttpLink({
    uri: configData.DEPLOYMENT_ONPRIM ? configData.SELF_API_URL : configData.API_URL,
    headers: {
        'Accept-Encoding': 'gzip, deflate, br'
    }
});

const authLink = new ApolloLink((operation: Operation, forward: NextLink) => {
    const token = sessionStorage.getItem("sessionKey");
    operation.setContext({
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Accept-Encoding': 'gzip, deflate, br'
        }
    });

    return forward(operation).map((response) => {
        if (response.errors) {
            let msg = response.errors[0]?.message || "Error occurred while performing operation";
            showToast(msg, 'error');
            if (msg.toLowerCase().includes("access is denied")) {
                showToast('Invalid Session, Please re-login and continue', 'error');
                Auth.signOut();
            }
        }
        return response;
    });
});

export const resetApolloClient = async () => {
    await client.clearStore();
    await client.resetStore();
};

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        addTypename: false,
    }),
});

export default client;

