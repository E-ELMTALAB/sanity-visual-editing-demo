"use client"

import { useState } from "react"

// کامپوننت اصلی فرم
export default function SubscriptionForm() {
  // State برای مدیریت مقادیر ورودی فرم
  const [duration, setDuration] = useState("1-month")
  const [subscriptionType, setSubscriptionType] = useState("single-user")
  const [createNewAccount, setCreateNewAccount] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <>
      {/* استایل‌های CSS در اینجا به صورت داخلی تعریف شده‌اند */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap');

        .sub-form-container {
          direction: rtl;
          font-family: 'Vazirmatn', sans-serif;
          max-width: 700px;
          margin: 40px auto;
          padding: 24px;
          background-color: #ffffff;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          color: #212529;
        }

        .sub-form-section {
          position: relative;
          padding-right: 20px;
          margin-bottom: 35px;
        }

        /* خط آبی کنار هر بخش */
        .sub-form-section::before {
          content: '';
          position: absolute;
          right: 0;
          top: 4px;
          height: calc(100% - 8px);
          width: 4px;
          background-color: #0d6efd;
          border-radius: 2px;
        }

        .sub-form-label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 12px;
          color: #495057;
        }

        /* استایل سفارشی برای Select Box */
        .select-wrapper {
          position: relative;
        }

        .select-wrapper select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%;
          padding: 12px 48px 12px 16px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          background-color: #f8f9fa;
          font-size: 0.95rem;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .select-wrapper select:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        /* آیکون فلش */
        .select-wrapper::after {
          content: '▼';
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%) scale(0.8);
          color: #6c757d;
          pointer-events: none;
        }

        /* نقطه رنگی */
        .select-dot {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #adb5bd;
          transition: background-color 0.2s;
        }
        
        .select-wrapper select:focus + .select-dot,
        .select-dot.active {
          background-color: #0d6efd;
        }


        /* استایل سفارشی برای Checkbox */
        .checkbox-container-wrapper {
            background-color: #f8f9fa;
            border: 1px solid #ced4da;
            border-radius: 8px;
            padding: 12px 16px;
        }
        
        .custom-checkbox {
          display: flex;
          align-items: center;
          justify-content: flex-end; /* تیک در سمت چپ قرار می‌گیرد */
          position: relative;
          cursor: pointer;
          font-size: 0.95rem;
          user-select: none;
        }

        .custom-checkbox input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .checkmark {
          height: 22px;
          width: 22px;
          background-color: #fff;
          border: 1px solid #adb5bd;
          border-radius: 4px;
          margin-left: 12px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .custom-checkbox:hover input ~ .checkmark {
          border-color: #0d6efd;
        }

        .custom-checkbox input:checked ~ .checkmark {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .checkmark:after {
          content: "";
          display: none;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .custom-checkbox input:checked ~ .checkmark:after {
          display: block;
        }
        
        /* بخش ورودی‌ها */
        .inputs-row {
          display: flex;
          flex-wrap: wrap; /* برای نمایش بهتر در موبایل */
          gap: 20px;
        }
        
        .input-group {
          flex: 1;
          min-width: 250px; /* حداقل عرض برای هر اینپوت */
        }

        .input-group-label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          background-color: #f8f9fa;
          font-size: 0.95rem;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .input-field:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        .input-field::placeholder {
          color: #adb5bd;
        }

        .input-field:disabled {
          background-color: #e9ecef;
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}</style>
    </>
  )
}
