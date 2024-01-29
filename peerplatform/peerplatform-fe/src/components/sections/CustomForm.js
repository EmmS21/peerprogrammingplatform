import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { SectionProps } from "../../utils/SectionProps";
import Input from "../elements/Input";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { Button } from "antd";

const propTypes = {
  ...SectionProps.types,
  split: PropTypes.bool,
};

const defaultProps = {
  ...SectionProps.defaults,
  split: false,
};

const CustomForm = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  split,
  ...props
}) => {
  const outerClasses = classNames(
    "cta section center-content-mobile reveal-from-bottom",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className,
  );

  const innerClasses = classNames(
    "cta-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider",
    split && "cta-split",
  );

  return (
    <section {...props} className={outerClasses}>
      <div className="cta-action">
        <Button
          onClick={() => window.location.replace("http://eepurl.com/iba1Yn")}
        >
          Subscribe to Mailing List
        </Button>
      </div>
    </section>
  );
};

CustomForm.propTypes = propTypes;
CustomForm.defaultProps = defaultProps;

export default CustomForm;
