// @flow

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition, VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import Avatar from "../avatar.jsx"

type Props = {|
  +volunteer: VolunteerDetailsAPIData,
  +isProjectAdmin: boolean,
  +isProjectCoOwner: boolean,
  +onOpenApplication: (VolunteerDetailsAPIData) => void,
  +onApproveButton: (VolunteerDetailsAPIData) => void,
  +onRejectButton: (VolunteerDetailsAPIData) => void,
  +onDismissButton: (VolunteerDetailsAPIData) => void,
  +onPromotionButton: (VolunteerDetailsAPIData) => void,
  +onDemotionButton: (VolunteerDetailsAPIData) => void
|};

class VolunteerCard extends React.PureComponent<Props> {

  render(): React$Node {
    const volunteer: ?UserAPIData = this.props.volunteer.user;
    const roleTag: ?TagDefinition = this.props.volunteer.roleTag;
    const volunteerUrl:string = url.section(Section.Profile, {id: volunteer.id});
    return (
      <div className="VolunteerCard-root">
        <a className="VolunteerCard-volunteerName" href={volunteerUrl} target="_blank" rel="noopener noreferrer">
          <Avatar user={volunteer} size={50} />
        </a>
        <a className="VolunteerCard-volunteerName" href={volunteerUrl} target="_blank" rel="noopener noreferrer">
          {volunteer && (volunteer.first_name + " " + volunteer.last_name)}
        </a>
        {(this.props.isProjectAdmin || this.props.isProjectCoOwner) ? this._renderShowApplicationMenu(volunteer) : null}
        <p className="VolunteerCard-volunteerRole">
          {roleTag && roleTag.display_name}
        </p>
      </div>
    );
  }

  _renderShowApplicationMenu(volunteer): ?React$Node {
    return (this.props.volunteer
      ?
        (<DropdownButton
          bsClass="VolunteerCard-dropdownButton dropdown"
          bsStyle="default"
          bsSize="small"
          title="..."
          noCaret
        >
          {this._renderApplicationMenuLinks()}
        </DropdownButton>)
      :
        null
      );
  }

  _renderApplicationMenuLinks(): ?Array<React$Node>  {
    if (this.props.volunteer && this.props.volunteer.isCoOwner) {
      return [
          (<MenuItem className="VolunteerCard-caution" onSelect={() => this.props.onDemotionButton(this.props.volunteer)} key="0">Demote</MenuItem>),
          (<MenuItem className="VolunteerCard-danger" onSelect={() => this.props.onDismissButton(this.props.volunteer)} key="1">Remove</MenuItem>)
        ]
    }
    if (this.props.volunteer && this.props.volunteer.isApproved) {
        return [
          (<MenuItem className="VolunteerCard-caution" onSelect={() => this.props.onPromotionButton(this.props.volunteer)} key="0">Promote</MenuItem>),
          (<MenuItem className="VolunteerCard-danger" onSelect={() => this.props.onDismissButton(this.props.volunteer)} key="1">Remove</MenuItem>)
        ]
    }
    if (this.props.volunteer) {
      return [
          (<MenuItem onSelect={() => this.props.onOpenApplication(this.props.volunteer)} key="2">Application</MenuItem>),
          (<MenuItem className="VolunteerCard-success" onSelect={() => this.props.onApproveButton(this.props.volunteer)} key="3">Accept</MenuItem>),
          (<MenuItem className="VolunteerCard-danger" onSelect={() => this.props.onRejectButton(this.props.volunteer)} key="4">Reject</MenuItem>)
      ];
    }
    return null;
  }
}

export default VolunteerCard;
