import styled from "styled-components";

export const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;
`;

export const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

export const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

interface ColumnProps {
  width: string;
}

export const StyledColumn = styled.span<ColumnProps>`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

export const StyledButton = styled.button`
  background: transparent;
  padding: 5px;
  cursor: pointer;

  transition: all 0.1s ease-in;

  &:hover {
    color: #ffffff;
  }
`;

export const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

export const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

export const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

export const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

export const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;
  font-size: 24px;
`;
