// @flow

import DjangoCSRFToken from 'django-react-csrftoken'
import React from 'react';
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import metrics from "../utils/metrics.js";

type State = {|
  username: string,
  password: string,
  errorMessage: string
|}

class LogInController extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      username: '',
      password: '',
      prevPage: window.location.href.split('&prev=')[1] || '',
      // errorMessage: url.arguments.(document.location.search)
    };
  }

  render(): React$Node {
    return (
      <div className="LogInController-root">
        <div className="LogInController-greeting">
          WELCOME BACK. LOG INTO YOUR ACCOUNT
        </div>
        <form action="/login/" method="post">
            <DjangoCSRFToken />
            <div>
              Email:
            </div>
            <div>
              <input
                className="LogInController-input"
                name="username"
                onChange={e => this.setState({username: e.target.value})}
                type="text"
              />
            </div>
            <div>
              Password:
            </div>
            <div>
              <input
                className="LogInController-input"
                name="password"
                onChange={e => this.setState({password: e.target.value})}
                type="password"
              />
            </div>
            <input name="prevPage" value={this.state.prevPage} type="hidden" />
            <div className="LogInController-bottomSection">
              <a href = "" className="LogInController-createAccount" onClick = {url.navigateToSection.bind(this, Section.SignUp)}> Don't Have an Account? </a>
              <span className="LogInController-forgotPassword" onClick = {url.navigateToSection.bind(this, Section.ResetPassword)} >
                <a href = "" className="LogInController-forgotPassword"> Forgot Password? </a>
              </span>
              <button
              className="LogInController-signInButton"
              disabled={!this.state.username || !this.state.password}
              type="submit"
              onClick={() => metrics.logSigninAttempt()}
              >
                Sign In
              </button>
            </div>
        </form>
      </div>
    );
  }
}

export default LogInController;
