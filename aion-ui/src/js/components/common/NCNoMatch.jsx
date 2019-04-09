import React, { Component } from "react";
import NCNonIdealState from "components/common/NCNonIdealState";
import {strings as MSG} from 'lib/NCTerms';

export default class NCNoMatch extends Component {

	render() {
		return (
			<NCNonIdealState
				paddingTop={140}
				icon={"pt-icon-offline"}
				title={MSG.no_match_title}
				description={MSG.no_match_description}/>
		);
	}
}
