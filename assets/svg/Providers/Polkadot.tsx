import React from 'react'

interface PolkaProps {
  className?: string
}

const Polkadot: React.FC<PolkaProps> = ({ className }) => (
  <svg className={className} width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25Z" fill="#ff8c00" />
    <path
      d="M12.5 3.51807C8.78571 3.51807 5.75 6.53592 5.75 10.2681C5.75 11.0181 5.875 11.7502 6.10714 12.4645C6.26786 12.9466 6.80357 13.2145 7.30357 13.0538C7.78571 12.8931 8.05357 12.3574 7.89286 11.8574C7.69643 11.3038 7.60714 10.7145 7.625 10.1252C7.69643 7.60735 9.73214 5.53592 12.25 5.41092C15.0536 5.26807 17.375 7.50021 17.375 10.2681C17.375 12.8574 15.3393 14.9824 12.7857 15.1252C12.7857 15.1252 11.8393 15.1788 11.375 15.2502C11.1429 15.2859 10.9643 15.3216 10.8393 15.3395C10.7857 15.3574 10.7321 15.3038 10.75 15.2502L10.9107 14.4645L11.7857 10.4288C11.8929 9.92878 11.5714 9.42878 11.0714 9.32164C10.5714 9.21449 10.0714 9.53592 9.96429 10.0359C9.96429 10.0359 7.85714 19.8574 7.83929 19.9645C7.73214 20.4645 8.05357 20.9645 8.55357 21.0716C9.05357 21.1788 9.55357 20.8574 9.66071 20.3574C9.67857 20.2502 9.96429 18.9466 9.96429 18.9466C10.1786 17.9466 11 17.2145 11.9643 17.0895C12.1786 17.0538 13.0179 17.0002 13.0179 17.0002C16.5 16.7324 19.25 13.8216 19.25 10.2681C19.25 6.53592 16.2143 3.51807 12.5 3.51807ZM12.9821 19.0538C12.375 18.9288 11.7679 19.3038 11.6429 19.9288C11.5179 20.5359 11.8929 21.1431 12.5179 21.2681C13.125 21.3931 13.7321 21.0181 13.8571 20.3931C13.9821 19.7681 13.6071 19.1788 12.9821 19.0538Z"
      fill="white"
    />
  </svg>
)

export default Polkadot
