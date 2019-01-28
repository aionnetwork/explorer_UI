import React, { Component } from "react";
import NCNonIdealState from "components/common/NCNonIdealState";

export default class NCNoMatch extends Component {

	render() {
		return (
			<NCNonIdealState
				paddingTop={140}
				icon={"pt-icon-offline"}
				title={"Oops ... Page Not Found"}
				description={"You've found a page that doesn't exist."}/>
		);
	}
}
