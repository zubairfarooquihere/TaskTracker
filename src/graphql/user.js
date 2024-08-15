import { gql } from "@apollo/client";

export const getMemberInfo = gql`
  query ($todoId: String!, $userId: String!) {
    getMemberInfo(todoId: $todoId, userId: $userId) {
      owner
      readAndWrite
      readOnly
      ownerName
    }
  }
`;

export const getComments = gql`
  query ($todoId: String!) {
    getComments(todoId: $todoId) {
      _id
      comment
      userId {
        email
        name
        _id
      }
    }
  }
`;

export const addComment = gql`
  mutation ($todoId: String!, $comment: String!, $userId: String!) {
    addComment(todoId: $todoId, comment: $comment, userId: $userId) {
      _id
      comment
    }
  }
`;

export const deleteComment = gql`
  mutation ($commentId: String!, $todoId: String!) {
    deleteComment(commentId: $commentId, todoId: $todoId)
  }
`;

export const getUsers = gql`
  query ($email: String!, $userId: String!) {
    findUser(email: $email, userId: $userId) {
      _id
      email
      name
    }
  }
`;

export const addUserToTodoGQL = gql`
  mutation($currentTeam: [inputTeam]!, $newTeam: [inputTeam]!, $todoId: String!, $userId: String!) {
    addUserToTodo(currentTeam: $currentTeam, newTeam: $newTeam, todoId: $todoId, userId: $userId) {
      _id
    }
  }
`;

export const deleteUserToTodoGQL = gql`
  mutation ($email: String!, $todoId: String!, $userId: String!) {
    deleteUserToTodo(email: $email, todoId: $todoId, userId: $userId) {
      user {
        _id
        email
        name
      }
      _id
      readAndWrite
      readOnly
    }
  }
`;