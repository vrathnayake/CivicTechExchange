// @flow
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import CurrentUser from "./CurrentUser.js";
import Section from "../enums/Section.js";
import _ from 'lodash'

const regex = {
  protocol: new RegExp("^(f|ht)tps?://", "i"),
  argumentSplit: new RegExp("([^=]+)=(.*)")
};

class urlHelper {
  static navigateToSection(section: string): void {
    UniversalDispatcher.dispatch({
      type: 'SET_SECTION',
      section: section,
      url: urlHelper.section(section)
    });
  }
  
  static section(section: string, args: ?Object): string {
    let sectionUrl = "?section=" + section;
    if(args) {
      sectionUrl += _.reduce(args, function(argsString, value, key) {
          return `${argsString}&${key}=${value}`;
        }, ""
      );
    }
    return sectionUrl;
  }
  
  static sectionOrLogIn(section: string): string {
    return CurrentUser.isLoggedIn()
      ? urlHelper.section(section)
      : urlHelper.section(Section.LogIn, {"prev": section});
  }
  
  // Construct a url with properly-formatted query string for the given arguments
  static constructWithQueryString(url: string, args: { [key: string]: string }): string {
    let result: string = url;
    if(!_.isEmpty(args)) {
      const existingArgs: {[key: string]: number} = urlHelper.arguments(url);
      result += _.isEmpty(existingArgs) ? "?" : "&";
      result += _.keys(args).map(key => key + "=" + args[key]).join("&");
    }
    return result;
  }
  
  static arguments(url: string): { [key: string]: string } {
    // Take argument section of url and split args into substrings
    const argStart = url.indexOf("?");
    if(argStart > -1) {
      let args = url.slice(argStart + 1).split("&");
      // Pull the key and value out of each arg substring into array pairs of [key,value]
      let argMatches = args.map(arg => regex.argumentSplit.exec(arg));
      let argPairs = argMatches.map(argMatch => [argMatch[1], argMatch[2]]);
      // Construct object from array pairs
      return _.fromPairs(argPairs);
    } else {
      return {};
    }
  }
  
  static getPreviousPageArg(): { [key: string]: string } {
    const url: string = window.location.href;
    // If prev arg already exists, use that
    const existingPrevSection: string = url.split('&prev=');
    return existingPrevSection.length > 1 ? {prev: existingPrevSection[1]} : {prev : url.split('?section=')[1]};
  }
  
  static appendHttpIfMissingProtocol(url: string): string {
    // TODO: Find a library that can handle this so we don't have to maintain regexes
    if (!regex.protocol.test(url)) {
      url = "http://" + url;
    }
    return url;
  }
  
  static beautify(url: string): string {
    // Remove http(s)
    return url.replace(regex.protocol, "");
  }
}

export default urlHelper
