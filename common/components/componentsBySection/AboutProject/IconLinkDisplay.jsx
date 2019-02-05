// @flow

import React from 'react';
import {LinkInfo} from "../../forms/LinkInfo.jsx";
import {LinkSourceDisplayConfig, LinkDisplayConfigurationByUrl, DefaultLinkDisplayConfigurations, LinkNames} from "../../constants/LinkConstants.js";
import {Glyph, GlyphSizes} from "../../utils/glyphs.js";
import Truncate from "../../utils/truncate.js";
import urlHelper from "../../utils/url.js";

type Props = {|
  +link: LinkInfo
|};

type State = {|
  displayConfig: ?LinkSourceDisplayConfig,
  topText: ?string,
  bottomText: ?string
|};

class IconLinkDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = props.link ? this.initializeState(props) : {};
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.link) {
      this.setState(this.initializeState(nextProps));
    }
  }
  
  initializeState(props: Props): State {
    const displayConfig: LinkSourceDisplayConfig = this.getLinkDisplayConfig(props.link);
    const topText: string = this.getTopText(props.link, displayConfig);
    const bottomText: string = displayConfig.sourceTypeDisplayName;
  
    return {
      displayConfig: displayConfig,
      topText: topText,
      bottomText: bottomText
    };
  }
  
  render(): ?React$Node {
    if(this.state.displayConfig) {
      return (
        <div className="IconLink-root">
          <a href={this.props.link.linkUrl}>
            <div className="IconLink-left">
              <i className={Glyph(this.state.displayConfig.iconClass, GlyphSizes.LG)} aria-hidden="true"></i>
            </div>
            <div className="IconLink-right">
              <p className="IconLink-topText">
                {this.state.topText}
              </p>
              <p className="IconLink-bottomText">
                {this.state.bottomText}
              </p>
            </div>
          </a>
        </div>
      );
    }
  }
  
  getLinkDisplayConfig(link: LinkInfo): LinkSourceDisplayConfig {
    //Check regexes for any specific website match
    const regexConfig: ?LinkSourceDisplayConfig = LinkDisplayConfigurationByUrl.find(
      (config:LinkSourceDisplayConfig) => config.sourceUrlPattern.test(link.linkUrl)
    );
    
    if(regexConfig) {
      return regexConfig;
    } else {
      //Then check for default configuration by link type
      return DefaultLinkDisplayConfigurations[link.linkName] || DefaultLinkDisplayConfigurations.other;
    }
  }
  
  getTopText(link: LinkInfo, displayConfig: LinkSourceDisplayConfig): string {
    // If a link to a known website, show that name
    if(displayConfig.sourceDisplayName) {
      return displayConfig.sourceDisplayName;
    } else if ((link.linkName in LinkNames) || !link.linkName) {
      return Truncate.stringT(urlHelper.beautify(link.linkUrl), 30);
    } else {
      return link.linkName;
    }
    
    // Else, show prettified url
  }
}

export default IconLinkDisplay;