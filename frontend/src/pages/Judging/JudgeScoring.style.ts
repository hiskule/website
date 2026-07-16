import styled from 'styled-components'

export const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, white 15%, #c9ecff 100%);
  padding: 100px 20px 40px;
`
export const Container = styled.div`
  max-width: 32rem;
  margin: 0 auto;
  padding: 1.5rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 15px rgb(0 0 0 / 10%);
`
export const Title = styled.h1`font-size: 1.5rem; text-align: center;`
export const Form = styled.form`display: flex; flex-direction: column; gap: 1rem;`
export const Field = styled.div`display: flex; flex-direction: column; gap: 0.25rem;`
export const Label = styled.label`font-weight: 600;`
export const Input = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.6rem;
`
export const Grid = styled.div`display: grid; gap: 1rem;`
export const Button = styled.button`
  border: 0;
  border-radius: 0.375rem;
  padding: 0.7rem;
  background: #000063;
  color: white;
  cursor: pointer;
  &:disabled { cursor: wait; opacity: 0.65; }
`
export const Message = styled.p`text-align: center; color: #374151; font-weight: 500;`
