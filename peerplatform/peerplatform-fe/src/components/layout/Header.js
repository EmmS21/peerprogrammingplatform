import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import Logo from "./partials/Logo";
import AuthContext from "../../context/AuthContext";
import "../../assets/other_css/index.css";

const propTypes = {
  navPosition: PropTypes.string,
  hideNav: PropTypes.bool,
  hideSignin: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool,
};

const defaultProps = {
  navPosition: "",
  hideNav: false,
  hideSignin: false,
  bottomOuterDivider: false,
  bottomDivider: false,
};

const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignin,
  bottomOuterDivider,
  bottomDivider,
  ...props
}) => {
  const [isActive, setIsactive] = useState(false);
  let {
    user,
    logOutUser,
    setLoginModalVisible,
    setIsSignupModalVisible,
    successSignup,
  } = useContext(AuthContext);
  const nav = useRef(null);
  const hamburger = useRef(null);

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener("keydown", keyPress);
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("keydown", keyPress);
      document.removeEventListener("click", clickOutside);
      closeMenu();
    };
  });

  useEffect(() => {
    if (successSignup === true) {
      setIsSignupModalVisible(false);
      setLoginModalVisible(true);
    }
  }, [successSignup]);

  const openMenu = () => {
    document.body.classList.add("off-nav-is-active");
    nav.current.style.maxHeight = nav.current.scrollHeight + "px";
    setIsactive(true);
  };

  const closeMenu = () => {
    document.body.classList.remove("off-nav-is-active");
    nav.current && (nav.current.style.maxHeight = null);
    setIsactive(false);
  };

  const keyPress = (e) => {
    isActive && e.keyCode === 27 && closeMenu();
  };

  const clickOutside = (e) => {
    if (!nav.current) return;
    if (
      !isActive ||
      nav.current.contains(e.target) ||
      e.target === hamburger.current
    )
      return;
    closeMenu();
  };

  const classes = classNames(
    "site-header",
    bottomOuterDivider && "has-bottom-divider",
    className,
  );

  return (
    <header {...props} className={classes}>
      <div className="container">
        <div
          className={classNames(
            "site-header-inner",
            bottomDivider && "has-bottom-divider",
          )}
        >
          <Logo />
          {!hideNav && (
            <>
              <button
                ref={hamburger}
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav
                ref={nav}
                className={classNames("header-nav", isActive && "is-active")}
              >
                <div className="header-nav-inner">
                  <ul
                    className={classNames(
                      "list-reset text-xs",
                      navPosition && `header-nav-${navPosition}`,
                    )}
                  ></ul>
                  {/* {!hideSignin && (
                    <ul className="list-reset header-nav-right">
                      <li>
                        {user ? (
                          <div className="parentButtons">
                            {user && <p>Welcome back {user.username}</p>}
                            <Link
                              id="dashboard-button"
                              to={"/profile"}
                              className="button button-primary button-wide-mobile button-sm"
                              onClick={closeMenu}
                            >
                              Dashboard
                            </Link>
                            <button
                              className="button button-primary button-wide-mobile button-sm"
                              onClick={logOutUser}
                            >
                              Logout
                            </button>
                          </div>
                        ) : (
                          <div className="parentButtons">
                            <Link
                              id="login"
                              className="button button-primary button-wide-mobile button-sm"
                              onClick={() => {
                                setLoginModalVisible((prevState) => !prevState);
                                setIsSignupModalVisible(false);
                              }}
                            >
                              Login
                            </Link>
                            <Link
                              id="signup"
                              className="button button-primary button-wide-mobile button-sm"
                              onClick={() => {
                                setIsSignupModalVisible(
                                  (prevState) => !prevState,
                                );
                                setLoginModalVisible(false);
                              }}
                            >
                              Sign Up
                            </Link>
                          </div>
                        )}
                      </li>
                    </ul>
                  )} */}
                </div>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
