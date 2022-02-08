import { render, screen } from '@testing-library/react';
import { TextInput } from '.';
import userEvent from '@testing-library/user-event';



describe('<TextInput />', () => {
  it('should have a value of SearchValue ', () => {
    const fn = jest.fn();
    render(<TextInput handleChange={fn} searchValue={"testing"}/>);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input.value).toBe('testing');

  });
  it('should call handleChange function on each key pressed', () => {
    const fn = jest.fn();
    render(<TextInput handleChange={fn} searchValue={"testing"}/>);
    const input = screen.getByPlaceholderText(/search/i);
    const value = 'the value';
    userEvent.type(input, value);
    expect(input.value).toBe('testing');
    expect(fn).toHaveBeenCalledTimes(value.length);
  });
  it('should match snapshot', () => {
    const fn = jest.fn();
    const {container} = render(<TextInput handleChange={fn} searchValue={'Value Searched'} />);
    expect(container).toMatchSnapshot();
  })
})
