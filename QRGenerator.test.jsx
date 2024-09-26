import { render, screen, fireEvent } from '@testing-library/react';
import QRGenerator from '../components/QRGenerator';

test('generates QR codes on button click', () => {
  render(<QRGenerator />);
  
  const textarea = screen.getByPlaceholderText(/https:\/\/example\.com/i);
  fireEvent.change(textarea, { target: { value: 'https://example.com' } });
  
  const button = screen.getByText(/إنشاء رموز QR/i);
  fireEvent.click(button);
  
  const qrCodeText = screen.getByText(/https:\/\/example\.com/i);
  expect(qrCodeText).toBeInTheDocument();
});