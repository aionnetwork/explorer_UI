/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Recaptcha from 'react-recaptcha';
import NCNonIdealState from 'components/common/NCNonIdealState'

import moment from 'moment';

import { TextArea, FormGroup, Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind, Toaster, ToasterPosition} from "@blueprintjs/core";
import {nc_LinkToEntity, nc_getChartData, nc_isObjectEmpty, nc_trim, nc_isValidEntity, nc_isPositiveInteger, nc_sanitizeHex, nc_isObjectValid } from 'lib/NCUtility';

import NCTxnTable from 'components/transactions/NCTxnTable';
import NCBlkDetail from 'components/blocks/NCBlkDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCComponentLazyLoad from 'components/common/NCComponentLazyLoad';
//import NCExplorerContactUs from 'components/common/NCExplorerContactUs';
import * as network from 'network/NCNetworkRequests';

class NCContactsRetrieve extends Component
{ 

  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      topic: '',
      notice:'',
      type: '',
      text:'',
      value:'',
      recaptcha:'',
      button: true,
      range: [0,1000],
      success: false,
      display:false
    } 
    this.captcha = this.captcha.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  captcha(key){
      this.setState({recaptcha:response})
  }

  verifyCallback(response) {
       //this.state.recaptcha = response;
        console.log(response);
        this.setState({recaptcha:response});
   };

   handleTypeChange(event) {
    
    this.setState({type : event.target.value});
    
  }
  handleTopicChange(event) {
    
    this.setState({topic : event.target.value});
    
  }
  handleTextChange(event) {
    //console.log('change');
    this.setState({text : event.target.value});
    
  }

   handle() {
    
    console.log('feedback test!');
   
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.value);
    console.log('feedback!'+this.state.text);
    event.preventDefault();

    if(nc_trim(this.state.topic)==''||nc_trim(this.state.text)==''||nc_trim(this.state.recaptcha)==''){
      this.setState({notice:'Please ensure that all fields are completed.'});
      this.addToast({ icon: "warning-sign", intent: Intent.DANGER, message: "Please ensure that all fields are completed." })
    }else{
      this.setState({success:true});
      network.submitFeedback(this.state.topic,this.state.text,this.state.recaptcha);
    }
  }

  addToast(t: IToastProps) {
        
        const toast = Toaster.create({
          position: Position.TOP,
        });

        t.className = '';
        t.timeout = 5000;
        toast.show(t);
    }

  captcha(key){
      this.setState({recaptcha:response});
      //console.log(response);
  }

  componentWillMount() {
    this.isFirstRenderAfterMount = true;
  }

  componentDidMount() {
    //this.requestDownload();
  }

  componentWillReceiveProps(nextProps) {
    this.isFirstRenderAfterMount = false;
  }

  
  render() {  

   const { isLoading, isDataValid, isDataEmpty, loadingStr, invalidDataStr, emptyDataStr } = this.props;

    //console.log(JSON.stringify(this.props.feedback));// create a variable to store the component instance
    let recaptchaInstance;
    const contact_success ={margin:'auto', textAlign:'center', border:'#ccc solid 1px',padding:'10px',borderRadius:'5px',maxWidth:'500px'}
    
    let success = this.state.success;//this.props.feedback.response;
    let message = <div style={contact_success}>
                    <h4 className="success">Success!</h4>
                    <p className="center">Thank you for your feedback.</p>
                  </div>
    //console.log(success);
    // create a reset function
    const resetRecaptcha = () => {
      recaptchaInstance.reset();  
    };

    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '#',
        body: 'Contact Us',
      }

    ];
      
    const contact_container ={margin:'auto',  border:'#ccc solid 1px',padding:'10px',borderRadius:'5px',maxWidth:'500px'}
    const contact_input ={width:"100%"}
    const contact_textArea ={width:"100%",height:"200px"}
    const contact_submit ={right:'10'}
    
   const form =  <div style={contact_container}>
        <form>
            
            <FormGroup
                
                label="Topic"
                labelFor="topic-input"
                labelInfo="(required)"
                className="pt-form-group "

            >
              <select id="topic-input" onChange={this.handleTopicChange} defaultValue="default"  style={contact_input} className="pt-input pt-large">
                <option value="default">Choose an item</option>
                <option value="Analytics">Analytics</option>
                <option value="Accounts">Accounts</option>
                <option value="Blocks">Blocks</option>
                <option value="Contracts">Contracts</option>
                <option value="Tokens">Tokens</option>
                <option value="Transactions">Transactions</option>
                <option value="Others">Others</option>
               
              </select>
            </FormGroup>
            {/*<FormGroup
               
                label="Type"
                labelFor="type-input"
                labelInfo="(required)"
            >
              <select  id="type-input" onChange={this.handleTypeChange} defaultValue="default"  style={contact_input} className="pt-input pt-large" >
                <option value="default">Choose an item...</option>
                <option value="bug">Bug</option>
                <option value="feature">Feature Request</option>
                <option value="suggestions">Suggestion</option>
                
              </select>
            </FormGroup>*/}
            <FormGroup
                
                label="Message"
                labelFor="text-input"
                labelInfo="(required)"
            >
              <TextArea
                id="text-input"
                large={true}
                intent={"#000"}
                className="pt-input pt-large"
                rows="6"
                style={contact_textArea}
                onChange={this.handleTextChange}
                
              />
            </FormGroup>
            
            
             {(!this.state.display)&& 
                <Recaptcha
                  ref={e => recaptchaInstance = e}
                 
                  sitekey="6LfwrXMUAAAAAEpZCdMFD0ba96ryOUDGPMyqHZPA"
                  verifyCallback={this.verifyCallback.bind(this)}
            />}

            
            {/*<input type="submit" value="Submit" />*/}
            <Button type="submit" intent="success" onClick={this.handleSubmit} text="Submit" />
        </form>  
        </div>;

       const page = <div>
        <NCExplorerHead
          
          breadcrumbs={breadcrumbs}
          title={"Contact Us"}
          subtitle={'We value your opinion'}
   

        /> 

        {(success!==false) ? message : form}
      
      </div>;
    return (
      
       <NCComponentLazyLoad>
        <NCExplorerSection
          className="NCExplorerPage"

          isLoading={isLoading}
          isDataValid={true} 
          isDataEmpty={false}
          
          loadingStr={loadingStr}
          invalidDataStr={invalidDataStr}
          emptyDataStr={emptyDataStr}
          isToplevelSection={true}
        
          content={page}/>
      </NCComponentLazyLoad>
    );
  }
}

export default connect((state) => {
  return ({
    feedback: state.feedback,
  })
})(NCContactsRetrieve);





















