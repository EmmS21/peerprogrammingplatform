import React from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import CustomForm from "./CustomForm";

const MailchimpForm = (props) => {
  const postURL = `https://gmail.us17.list-manage.com/subscribe/post?u=${process.env.REACT_APP_MAILCHIMP_U}$id=${process.env.REACT_APP_MAILCHIMP_ID}`;
  return (
    <div>
      <MailchimpSubscribe
        url={postURL}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            subscribe={{ EMAIL: "newuser@gmail.com", FNAME: "Django Man" }}
            onValidated={(formData) => formData}
          />
        )}
      />
    </div>
  );
};

export default MailchimpForm;
