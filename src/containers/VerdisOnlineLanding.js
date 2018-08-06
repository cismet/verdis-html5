
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';

import { Panel, Form, FormGroup, Grid, Row,Col } from 'react-bootstrap';
import Loadable from 'react-loading-overlay';

import { routerActions as RoutingActions } from 'react-router-redux';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as KassenzeichenActions } from '../redux/modules/kassenzeichen';
import { actions as AuthActions } from '../redux/modules/auth';
import MaskedFormControl from 'react-bootstrap-maskedinput';
import queryString from 'query-string';


function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    auth: state.auth,
    mapping: state.mapping,
    routing: state.routing,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(MappingActions, dispatch),
    routingActions: bindActionCreators(RoutingActions,dispatch),
    kassenzeichenActions: bindActionCreators(KassenzeichenActions,dispatch),
    authActions: bindActionCreators(AuthActions,dispatch),
  };
}

export function createLeafletElement () {}    

export class Landing_ extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleSTACInput = this.handleSTACInput.bind(this);   
        this.handleSTAC = this.handleSTAC.bind(this);   
        this.currentSTAC=null;
        this.background="background.jpg";
        
    }
    componentDidMount() {
        if (this.stacInput) {
            const input=ReactDOM.findDOMNode(this.stacInput);
            if (input) {
                input.focus();
                input.selectionStart=input.value.trim().length;
                input.selectionEnd=input.value.trim().length;
            }

        }
        this.props.authActions.logout();


        let stac=queryString.parse(this.props.routing.location.search).stac;

        this.handleSTAC(stac);
        if (queryString.parse(this.props.routing.location.search).bg) {
            this.background=queryString.parse(this.props.routing.location.search).bg;
        }
    }

    handleSTACInput(e) {
        this.handleSTAC(e.target.value);
        this.stacInputField=e.target;
    }

    handleSTAC(rawSTAC) {
        if (rawSTAC){
            let stac = rawSTAC.trim().replace(/-/g, '');
            this.currentSTAC=rawSTAC;
            if (stac.length===12){
                this.props.kassenzeichenActions.getKassenzeichenbySTAC(stac, (success)=> {
                    if (success===true) {
                        setTimeout(()=>{
                            this.props.routingActions.push("/meinkassenzeichen");
                        },100);
                    } else {
                        setTimeout(()=>{
                            if (this.stacInputField) {
                                //ugly winning. should be done either via state or via ref
                                this.stacInputField.value="";
                            }   
                            else {
                                this.props.routingActions.push("/");
                            }                         
                        },1000);

                    }
                });
            }
        }
    }

    render() {
        this.stac=queryString.parse(this.props.routing.location.search).stac;
        if (this.stac) {
            if (this.currentSTAC!==this.stac){
                this.handleSTAC(this.stac);
            }
        }
        let landingStyle={
            backgroundColor: "red",
            height: this.props.uiState.height,
            width: "100%",
            background: "url('/images/"+this.background+"')",
            backgroundSize : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        };
        const panelStyle = {
            backgroundColor: 'rgba(255,255,255,1)',
            border: 0,
            paddingLeft: 40,
            paddingRight: 40,
            paddingBottom: 10,
            paddingTop: 10,
           
          };
        return (
            <div style={landingStyle}>
                <Grid>
                    <Row className="show-grid">
                        <Col xs={12} md={12}>
                            <h1 style={{color:"white"}}><img alt="" width={100} src="/images/wuppertal-white.svg"/> verdis-online</h1>
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col xs={12} md={12}>
                            <div style={{position: 'fixed',top:this.props.uiState.height-200}}>

                    <Loadable
                        active={this.props.auth.loginInProgress}
                        spinner
                        text="Laden der Daten ..."
                        >
                    <Panel style={panelStyle}>
                        <h3>Zugangscode:</h3>
                        <Form horizontal className="LoginForm" id="loginForm">
                            <FormGroup controlId="stacInput">
                            <MaskedFormControl 
                                key={"MaskedFormControl.with"+this.stac}
                                style={{
                                    height: "50px",
                                    border: "1px solid #9999992",
                                    padding: "5px",
                                    fontSize: "24px",
                                    fontFamily: "monospace"
                                }}
                                ref={(input) => { this.stacInput = input; }}  
                                placeholderChar=" " 
                                type="text" 
                                name="stac" 
                                mask="AAAA-AAAA-AAAA"
                                value={this.stac}
                                onChange={this.handleSTACInput}/>
                            </FormGroup>                         
                        </Form>
                    </Panel>
                    </Loadable>

                            </div>
                        </Col>
                    </Row>
                </Grid>

            </div>
        );
    }

}


const Landing = connect(mapStateToProps,mapDispatchToProps)(Landing_);
export default Landing;

Landing_.propTypes = {
  ui: PropTypes.object,
  kassenzeichen: PropTypes.object,
  mapping: PropTypes.object,
  uiState: PropTypes.object,
  auth: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  kassenzeichenActions: PropTypes.object.isRequired,
  uiStateActions: PropTypes.object.isRequired,
  mappingActions: PropTypes.object.isRequired,
  authActions: PropTypes.object.isRequired,
  routingActions: PropTypes.object.isRequired,
};
