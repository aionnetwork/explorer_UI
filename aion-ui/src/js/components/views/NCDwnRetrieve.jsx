/* eslint-disable */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import moment from 'moment';

import Recaptcha from 'react-recaptcha';

import {  DateRangeInput } from "@blueprintjs/datetime";

import { Position,RangeSlider, Button } from "@blueprintjs/core";


import { NCEntity} from 'lib/NCEnums';


//import { nc_FindEntity, nc_CanLinkToEntity, nc_LinkToEntity, nc_isObjectEmpty, nc_isStrEmpty, nc_trim } from 'lib/NCUtility';

import * as network from 'network/NCNetworkRequests';

class NCDwnRetrieve extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      queryStr: '',
      entity: NCEntity.ACCOUNT,
      recaptcha:'',
      button: true,
      range: [0,1000],
      dateRange: [null,null],
      start:null,
      end:null,
      display:false
    } 
    this.captcha = this.captcha.bind(this);
  }

  componentWillMount() {
    this.isFirstRenderAfterMount = true;
  }

  componentDidMount() {
    this.requestDownload();
  }

  componentWillReceiveProps(nextProps) {
    this.isFirstRenderAfterMount = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.accId != this.props.params.accId)
      this.requestDownload();
  }

  requestDownload = () => {
       //this.download('uyuy');
       //network.getAccRetrieveCSV(this.props.params.accId, 'nothing');      
  }

  captcha(key){
      this.setState({recaptcha:response})
  }

  download(a){
       //console.log(a);
       this.setState({button:true,display:true});
       
       network.getAccTxnRetrieveCSV(this.props.params.accId, a,this.state.start,this.state.end,this.state.range);
       //return;
  }

  verifyCallback(response) {
       //this.state.recaptcha = response;
       //console.log(response);
        this.setState({recaptcha:response,button:false});
   };

   handleValueChange = (range: NumberRange) => this.setState({ range });
   
   handleDateValueChange = (dateRange: NumberRange) => this.setState({ dateRange });

   handleRangeChange = (date) => {
    //console.log(date[0]);
    this.setState({
        start: date[0], end: date[1],rangeChange:false
      });
  }

  render() {
    
    
    const style = {position:'relative',textAlign:'center',width:'100%',margin:'auto',top:'100px',padding:'25px' };
    const recapcontainer = {position:'relative',width:'400px',margin:'auto',top:'100px',padding:'5px' };
    const stylerecaptcha = {left:'48px'};

    // create a variable to store the component instance
    let recaptchaInstance;
 
    // create a reset function
    const resetRecaptcha = () => {
      recaptchaInstance.reset();  
    };

    let button = this.state.button;
    let recaptcha= this.state.recaptcha;
    let range = this.state.range;

    let start = this.state.start;
    let end = this.state.end;

    //console.log(JSON.stringify(this.state.dateRange));

    return (
      <div className= {''} style = {style}>

        <p>To complete your download, please verify that you are not a robot by completing the captcha below then click download. </p>
       
       <div className= {''} style = {recapcontainer}>
        {(!this.state.display)&& 
          <Recaptcha
          ref={e => recaptchaInstance = e}
          style = {stylerecaptcha}
          sitekey="6LfwrXMUAAAAAEpZCdMFD0ba96ryOUDGPMyqHZPA"
          verifyCallback={this.verifyCallback.bind(this)}
        />}
        <br/><br/>
        {(false)&& <div><p>Please select transaction range.</p> <RangeSlider
                    min={0}
                    max={1000000}
                    stepSize={10000}
                    labelStepSize={250000}
                    onChange={this.handleValueChange}
                    disabled={button}
                    value={range}
                    vertical={false}
                /></div>
        }
        {(!this.state.display)&& <div><p>Please select transaction range.</p> 
        <DateRangeInput
          formatDate={date => date.toLocaleString()}
          onChange={this.handleRangeChange}
          parseDate={str => new Date(str)}
          value={[start,end]}
          minDate={new Date(2018, 3, 22)}
          maxDate={new Date()}
        />
        </div>
        }  
        {(!this.state.display)&&
        <Button  text='Download' disabled={button} onClick={() => {resetRecaptcha(); this.download(recaptcha)}} className = "pt-button pt-minimal" rightIconName="download" />
        }
        <br/>
        {(this.state.display)&&
        <h5>Please wait, this might take a while!</h5>
        }
       </div>
        
      </div>
    );
  }
}

export default connect((state) => {
  return ({
    accRetrieve: state.accRetrieve,
  })
})(NCDwnRetrieve);

