import { gql } from "@apollo/client";

export const Login_Mutation = gql`
mutation login(
  $username: String!
  $password: String!
) {
  login(username: $username, password: $password) {
    message
    messageType
    accessToken
    sessionTimeout
    reportUrl
    emilyUrl
    data
    webName
    ticket
    hostUrl
  }
}
`;


export const Users_Query = gql`
  query GetIdentites($pagenumber: Int!, $pagesize: Int!, $filters: String!, $order:OrderByConditionInput!) {
    identities(
      pagenumber: $pagenumber
      pagesize: $pagesize
      filters: $filters
      order: $order
    ) {
      data {
        id
        firstname
        lastname
        employeeid
        company
        email
        status
        onprim
      }
      total
      pageSize
      pageNumber
    }
  }
`;

export const System_Categories = gql`
  query GetCategories($categorises: [String]!) {
    all(categorises:$categorises) {
      keyid
      keyvalue
      category
    }
  }
`;