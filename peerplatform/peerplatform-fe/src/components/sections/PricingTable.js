import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';
import { BiCheckboxSquare } from "react-icons/bi";
import '../../assets/pricingtable_css/PricingTable.css';

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}
const PricingTable = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'features-tiles section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-tiles-inner section-inner pt-0',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap center-content',
    pushLeft && 'push-left'
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <div className="App">
            <header className="App-header"></header>
            <div className="table centered">
                <div className="row">
                    <div className="column">
                        <ul className="price">
                            <li className="header">
                                Free Trial
                                <br />
                                <br />
                                <p>Try our platform for 5 days </p>
                                <div className="button_cont" align="center">
                                    <a className="btn" target="_blank" rel="nofollow noopener">
                                        Try it out
                                    </a>
                                    <br />
                                </div>
                            </li>
                            <li>
                              <p>Try our platform for 5 days at no cost</p>
                            </li>
                        </ul>
                    </div>
                    <div className="column">
                        <ul className="price">
                            <li className="header">
                                Unlimited Access
                                <br />
                            <span className="dollar">15</span>
                            <p>per month</p>
                            <div className="button_cont" align="center">
                                <a className="btn" target="_blank" rel="nofollow noopener">
                                Sign Up
                                </a>
                            </div>
                            </li>
                            <li>
                               <p>Get unlimited access</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

PricingTable.propTypes = propTypes;
PricingTable.defaultProps = defaultProps;

export default PricingTable;