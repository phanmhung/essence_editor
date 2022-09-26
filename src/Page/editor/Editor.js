import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  mxGraph,
  mxRubberband,
  mxKeyHandler,
  mxUndoManager,
  mxClient,
  mxUtils,
  mxPerimeter,
  mxConnectionHandler,
  mxConstants,
  mxEvent,
} from 'mxgraph-js';
import Alpha from '../../Assets/EssenceKernel/Alpha.png';
import ActivityPng from '../../Assets/EssenceKernel/Activity.png';
import ActivitySpacePng from '../../Assets/EssenceKernel/Activity_Space.png';
import CompetencyPng from '../../Assets/EssenceKernel/Competency.png';
import WorkProductPng from '../../Assets/EssenceKernel/Work_Product.png';
import AlphaEndeavorPng from '../../Assets/EssenceKernel/Alpha_Endeavor.png';
import ActivityEndeavorPng from '../../Assets/EssenceKernel/Activity_Endeavor.png';
import ActivitySpaceEndeavorPng from '../../Assets/EssenceKernel/Activity_Space_Endeavor.png';
import CompetencyEndeavorPng from '../../Assets/EssenceKernel/Competency_Endeavor.png';
import WorkProductEndeavorPng from '../../Assets/EssenceKernel/Work_Product_Endeavor.png';
import AlphaCustomerPng from '../../Assets/EssenceKernel/Alpha_Customer.png';
import ActivityCustomerPng from '../../Assets/EssenceKernel/Activity_Customer.png';
import ActivitySpaceCustomerPng from '../../Assets/EssenceKernel/Activity_Space_Customer.png';
import CompetencyCustomerPng from '../../Assets/EssenceKernel/Competency_Customer.png';
import WorkProductCustomerPng from '../../Assets/EssenceKernel/Work_Product_Customer.png';
import AlphaSolutionPng from '../../Assets/EssenceKernel/Alpha_Solution.png';
import ActivitySolutionPng from '../../Assets/EssenceKernel/Activity_Solution.png';
import ActivitySpaceSolutionPng from '../../Assets/EssenceKernel/Activity_Space_Solution.png';
import CompetencySolutionPng from '../../Assets/EssenceKernel/Competency_Solution.png';
import WorkProductSolutionPng from '../../Assets/EssenceKernel/Work_Product_Solution.png';

import KernelDetail from '../../Component/kernelDetail/KernelDetail';
import Modal from '@material-ui/core/Modal/Modal';
import {
  Button,
  AppBar,
  Toolbar,
  Drawer,
  CssBaseline,
  List,
  ListItem,
  Typography,
  Link,
} from '@material-ui/core';
import axios from 'axios';
import { withStyles } from '@material-ui/core';
import Background from '../../Assets/paper-background.jpg';
const CircularJSON = require('circular-json');

const drawerWidth = 200;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    marginRight: theme.spacing.unit * 6,
  },
  btn: {
    marginRight: theme.spacing.unit * 2,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  graphContainer: {
    backgroundImage: `url(${Background})`,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      openForm: false,
      name: '',
      description: '',
      author: '',
      intention: [],
      graph_global: null,
      detail_data: null,
      essence_kernel: [],
      edge: [],
    };

    this.refreshGraph = this.refreshGraph.bind(this);
    this.LoadGraph = this.LoadGraph.bind(this);
    this.addAlpha = this.addAlpha.bind(this);
    this.addActivity = this.addActivity.bind(this);
    this.addActivitySpace = this.addActivitySpace.bind(this);
    this.addCompetency = this.addCompetency.bind(this);
    this.addWorkProduct = this.addWorkProduct.bind(this);
    this.toJSON = this.toJSON.bind(this);
    this.saveData = this.saveData.bind(this);
    this.stringifyWithoutCircular = this.stringifyWithoutCircular.bind(this);

    console.log(this.props.match.params.id);

    axios
      .get('http://localhost:8085/method/' + this.props.match.params.id)
      .then((result) => {
        console.log(result.data);
        this.setState({
          loading: false,
          name: result.data.name,
          description: result.data.description,
          author: result.data.author,
          intention: result.data.intention,
          edge: CircularJSON.parse(CircularJSON.stringify(result.data.edge)),
          essence_kernel: CircularJSON.parse(
            CircularJSON.stringify(result.data.essence_kernel)
          ),
        });
        this.LoadGraph();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  stringifyWithoutCircular(json) {
    return JSON.stringify(
      json,
      (key, value) => {
        if (
          (key === 'parent' || key == 'source' || key == 'target') &&
          value !== null
        ) {
          return value.id;
        } else if (key === 'value' && value !== null && value.localName) {
          let results = {};
          Object.keys(value.attributes).forEach((attrKey) => {
            const attribute = value.attributes[attrKey];
            results[attribute.nodeName] = attribute.nodeValue;
          });
          return results;
        }
        return value;
      },
      4
    );
  }

  openModal() {
    this.setState({
      openForm: true,
    });
  }

  handleClose() {
    this.setState({
      openForm: false,
      detail_data: null,
    });
  }

  saveData() {
    var essence_kernel_data = JSON.parse(
      this.stringifyWithoutCircular(this.state.essence_kernel)
    );

    // for (var i = 0 ; i < this.state.essence_kernel.length ; i++) {
    //     delete this.state.essence_kernel[i].parent
    //     essence_kernel_data.push(JSON.parse(this.stringifyWithoutCircular(this.state.essence_kernel[i])))
    // }

    var edge_data = JSON.parse(this.stringifyWithoutCircular(this.state.edge));

    // for (var i = 0 ; i < this.state.edge.length ; i++) {
    //     delete this.state.edge[i].parent
    //     edge_data.push(util.inspect(CircularJSON.parse(this.stringifyWithoutCircular(this.state.edge[i]))))
    // }

    let data = {
      name: this.state.name,
      description: this.state.description,
      author: this.state.author,
      intention: this.state.intention,
      edge: edge_data,
      essence_kernel: essence_kernel_data,
    };

    axios
      .put('http://localhost:8085/method/' + this.props.match.params.id, data)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(this.state);
  }

  componentDidMount() {}

  toJSON() {
    const element = document.createElement('a');

    var data_json_dynamic = {
      name_id: '',
      name: '',
      description: '',
      intention: [],
      activitySpace: [],
      alpha: [],
      competencies: [],
      patterns: [],
      extensionElements: [],
    };

    var alpha = this.state.essence_kernel.filter(function (kernel) {
      return kernel.detail.type === 'Alpha';
    });

    for (var i = 0; i < alpha.length; i++) {
      let data = {
        name_id: alpha[i].value.replace(/\s/g, ''),
        name: alpha[i].value,
        description: alpha[i].detail.description,
        workProduct: [],
        state: [],
        subAlpha: [],
      };

      let alpha_detail = alpha[i].detail;

      for (var j = 0; j < alpha_detail.workProduct.length; j++) {
        let workProductData = {
          name_id: alpha_detail.workProduct[j].value.replace(/\s/g, ''),
          name: alpha_detail.workProduct[j].value,
          description: alpha_detail.workProduct[j].detail.description,
          level_of_detail: alpha_detail.workProduct[j].detail.level_of_detail,
        };

        data.workProduct.push(workProductData);
      }

      for (var j = 0; j < alpha_detail.state.length; j++) {
        let state = {
          name_id: alpha_detail.state[j].name.replace(/\s/g, ''),
          name: alpha_detail.state[j].name,
          description: alpha_detail.state[j].description,
          checklist: alpha_detail.state[j].checkList,
        };

        data.state.push(state);
      }

      for (var j = 0; j < alpha_detail.subAlpha.length; j++) {
        let subAlpha = {
          name_id: alpha_detail.subAlpha[i].value.replace(/\s/g, ''),
          name: alpha_detail.subAlpha[i].value,
          description: alpha_detail.subAlpha[i].detail.description,
          workProduct: [],
          state: [],
        };

        let subAlpha_detail = alpha_detail.subAlpha[i].detail;

        for (var k = 0; k < subAlpha_detail.workProduct.length; k++) {
          let workProductData = {
            name_id: subAlpha_detail.workProduct[k].value.replace(/\s/g, ''),
            name: subAlpha_detail.workProduct[k].value,
            description: subAlpha_detail.workProduct[k].detail.description,
            level_of_detail:
              subAlpha_detail.workProduct[k].detail.level_of_detail,
          };

          subAlpha.workProduct.push(workProductData);
        }

        for (var k = 0; k < subAlpha_detail.state.length; k++) {
          let state = {
            name_id: subAlpha_detail.state[k].name.replace(/\s/g, ''),
            name: subAlpha_detail.state[k].name,
            description: subAlpha_detail.state[k].description,
            checklist: subAlpha_detail.state[k].checkList,
          };

          subAlpha.state.push(state);
        }

        data.subAlpha.push(subAlpha);
      }

      data_json_dynamic.alpha.push(data);
    }

    var activitySpace = this.state.essence_kernel.filter(function (kernel) {
      return kernel.detail.type === 'ActivitySpace';
    });

    for (var i = 0; i < activitySpace.length; i++) {
      let data = {
        name_id: activitySpace[i].value.replace(/\s/g, ''),
        name: activitySpace[i].value,
        description: activitySpace[i].detail.description,
        activity: [],
      };

      var detail = activitySpace[i].detail;

      for (var j = 0; j < detail.activity.length; j++) {
        let activity = {
          name_id: detail.activity[j].value.replace(/\s/g, ''),
          name: detail.activity[j].value,
          description: detail.activity[j].detail.description,
          completionCriterion: {
            alphas: [],
            workProduct: [],
          },
          entryCriterion: {
            alphas: [],
            workProduct: [],
          },
          competencies: detail.activity[j].detail.competencies,
        };

        let act_detail = detail.activity[j].detail;

        for (var k = 0; k < act_detail.entryCriterion.alphas.length; k++) {
          activity.entryCriterion.alphas.push(
            act_detail.entryCriterion.alphas[k].value
          );
        }

        for (var k = 0; k < act_detail.entryCriterion.workProduct.length; k++) {
          activity.entryCriterion.workProduct.push(
            act_detail.entryCriterion.workProduct[k].value
          );
        }

        for (var k = 0; k < act_detail.completionCriterion.alphas.length; k++) {
          activity.completionCriterion.alphas.push(
            act_detail.completionCriterion.alphas[k].value
          );
        }

        for (
          var k = 0;
          k < act_detail.completionCriterion.workProduct.length;
          k++
        ) {
          activity.completionCriterion.workProduct.push(
            act_detail.completionCriterion.workProduct[k].value
          );
        }

        data.activity.push(activity);
      }

      data_json_dynamic.activitySpace.push(data);
    }

    var activity = this.state.essence_kernel.filter(function (kernel) {
      return kernel.detail.type === 'Activity';
    });

    var workProduct = this.state.essence_kernel.filter(function (kernel) {
      return kernel.detail.type === 'WorkProduct';
    });

    var competency = this.state.essence_kernel.filter(function (kernel) {
      return kernel.detail.type === 'Competency';
    });

    for (var i = 0; i < competency.length; i++) {
      let data = {
        name_id: competency[i].value.replace(/\s/g, ''),
        name: competency[i].value,
        description: competency[i].detail.description,
        level: [],
      };
      competency[i].detail.level.Assists
        ? data.level.push('Assists')
        : competency[i].detail.level.Adapt
        ? data.level.push('Adapt')
        : competency[i].detail.level.Innovates
        ? data.level.push('Innovates')
        : competency[i].detail.level.Innovates
        ? data.level.push('Innovates')
        : data_json_dynamic.competencies.push(data);
    }

    data_json_dynamic.name_id = this.state.name.replace(/\s/g, '');
    data_json_dynamic.name = this.state.name;
    data_json_dynamic.description = this.state.description;
    data_json_dynamic.intention = this.state.intention;

    var jsonse = JSON.stringify(data_json_dynamic, 0, 4);
    const file = new Blob([jsonse], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = data_json_dynamic.name + '.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  addAlpha() {
    let newAlpha = {
      name: 'New Alpha',
      type: 'Alpha',
      x: 500,
      y: 120,
      width: 80,
      height: 30,
      style: 'Alpha',
    };

    var graph = this.state.graph_global;

    // Gets the default parent for inserting new cells. This is normally the first
    // child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();

    let a = this.state.graph_global.insertVertex(
      parent,
      null,
      newAlpha.name,
      newAlpha.x,
      newAlpha.y,
      newAlpha.width,
      newAlpha.height,
      newAlpha.style
    );
    a.detail = {
      description: '',
      type: 'Alpha',
      workProduct: [],
      state: [],
      area: '',
      subAlpha: [],
      isSubAlpha: false,
      hasSubAlpha: false,
    };

    this.state.essence_kernel.push(a);

    this.refreshGraph();
  }

  addActivity() {
    let newActivity = {
      name: 'New Activity',
      type: 'Activity',
      x: 500,
      y: 160,
      width: 80,
      height: 30,
      style: 'Activity',
    };

    var graph = this.state.graph_global;

    // Gets the default parent for inserting new cells. This is normally the first
    // child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();

    let a = this.state.graph_global.insertVertex(
      parent,
      null,
      newActivity.name,
      newActivity.x,
      newActivity.y,
      newActivity.width,
      newActivity.height,
      newActivity.style
    );
    a.detail = {
      description: '',
      type: 'Activity',
      completionCriterion: {
        alphas: [],
        workProduct: [],
      },
      area: '',
      entryCriterion: {
        alphas: [],
        workProduct: [],
      },
      competencies: [],
    };

    this.state.essence_kernel.push(a);

    this.refreshGraph();
  }

  arrayRemove(value) {
    this.state.essence_kernel = this.state.essence_kernel.filter(function (
      ele
    ) {
      return ele != value;
    });
  }

  addActivitySpace() {
    let newActivitySpace = {
      name: 'New Activity Space',
      type: 'ActivitySpace',
      x: 500,
      y: 200,
      width: 80,
      height: 30,
      style: 'ActivitySpace',
    };

    var graph = this.state.graph_global;

    // Gets the default parent for inserting new cells. This is normally the first
    // child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();

    let a = this.state.graph_global.insertVertex(
      parent,
      null,
      newActivitySpace.name,
      newActivitySpace.x,
      newActivitySpace.y,
      newActivitySpace.width,
      newActivitySpace.height,
      newActivitySpace.style
    );
    a.detail = {
      type: 'ActivitySpace',
      area: '',
      description: '',
      activity: [],
    };

    this.state.essence_kernel.push(a);

    this.refreshGraph();
  }

  addCompetency() {
    let newCompetency = {
      name: 'New Competency',
      type: 'Competency',
      x: 500,
      y: 240,
      width: 80,
      height: 30,
      style: 'Competency',
    };

    var graph = this.state.graph_global;

    // Gets the default parent for inserting new cells. This is normally the first
    // child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();

    let a = this.state.graph_global.insertVertex(
      parent,
      null,
      newCompetency.name,
      newCompetency.x,
      newCompetency.y,
      newCompetency.width,
      newCompetency.height,
      newCompetency.style
    );

    a.detail = {
      description: '',
      type: 'Competency',
      area: '',
      level: {
        Assists: '',
        Applies: '',
        Masters: '',
        Adapt: '',
        Innovates: '',
      },
    };

    this.state.essence_kernel.push(a);

    this.refreshGraph();
  }

  addWorkProduct() {
    let newWorkProduct = {
      name: 'New Work Product',
      type: 'WorkProduct',
      x: 500,
      y: 280,
      width: 80,
      height: 30,
      style: 'WorkProduct',
    };

    var graph = this.state.graph_global;

    // Gets the default parent for inserting new cells. This is normally the first
    // child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();

    let a = this.state.graph_global.insertVertex(
      parent,
      null,
      newWorkProduct.name,
      newWorkProduct.x,
      newWorkProduct.y,
      newWorkProduct.width,
      newWorkProduct.height,
      newWorkProduct.style
    );
    a.detail = {
      type: 'WorkProduct',
      area: '',
      description: '',
      level_of_detail: [],
    };

    this.state.essence_kernel.push(a);

    this.refreshGraph();
  }

  refreshGraph() {
    var container = ReactDOM.findDOMNode(this.refs.divGraph);

    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error('Browser is not supported!', 200, false);
    } else {
      // Disables the built-in context menu
      mxEvent.disableContextMenu(container);

      // Creates the graph inside the given container
      var graph = this.state.graph_global;

      // Gets the default parent for inserting new cells. This is normally the first
      // child of the root (ie. layer 0).

      graph.getModel().beginUpdate();

      try {
      } catch (e) {
        console.log(e);
      } finally {
        // Updates the display
        graph.getModel().endUpdate();
      }

      // Enables rubberband (marquee) selection and a handler for basic keystrokes
      var rubberband = new mxRubberband(graph);
      var keyHandler = new mxKeyHandler(graph);
    }
  }

  LoadGraph() {
    var container = ReactDOM.findDOMNode(this.refs.divGraph);
    console.log(container);
    var zoomPanel = ReactDOM.findDOMNode(this.refs.divZoom);

    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error('Browser is not supported!', 200, false);
    } else {
      // Disables the built-in context menu
      mxEvent.disableContextMenu(container);

      // Creates the graph inside the given container

      this.state.graph_global = new mxGraph(container);

      // Enables rubberband selection
      new mxRubberband(this.state.graph_global);

      // Gets the default parent for inserting new cells. This is normally the first
      // child of the root (ie. layer 0).
      var parent = this.state.graph_global.getDefaultParent();

      // Enables tooltips, new connections and panning
      this.state.graph_global.setPanning(true);
      this.state.graph_global.setTooltips(true);
      this.state.graph_global.setConnectable(true);
      this.state.graph_global.setEnabled(true);
      this.state.graph_global.setEdgeLabelsMovable(false);
      this.state.graph_global.setVertexLabelsMovable(false);
      this.state.graph_global.setGridEnabled(true);
      this.state.graph_global.setAllowDanglingEdges(false);
      // graph.splitEnabled = false;

      //Activity Style
      var Activity = {};
      Activity[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      Activity[mxConstants.STYLE_IMAGE] = ActivityPng;
      Activity[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('Activity', Activity);

      var ActivityEndeavor = {};
      ActivityEndeavor[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      ActivityEndeavor[mxConstants.STYLE_IMAGE] = ActivityEndeavorPng;
      ActivityEndeavor[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('ActivityEndeavor', ActivityEndeavor);

      var ActivityCustomer = {};
      ActivityCustomer[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      ActivityCustomer[mxConstants.STYLE_IMAGE] = ActivityCustomerPng;
      ActivityCustomer[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('ActivityCustomer', ActivityCustomer);

      var ActivitySolution = {};
      ActivitySolution[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      ActivitySolution[mxConstants.STYLE_IMAGE] = ActivitySolutionPng;
      ActivitySolution[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('ActivitySolution', ActivitySolution);

      //Activity Space Style

      var ActivitySpace = {};
      ActivitySpace[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      ActivitySpace[mxConstants.STYLE_IMAGE] = ActivitySpacePng;
      ActivitySpace[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('ActivitySpace', ActivitySpace);

      var ActivitySpaceEndeavor = {};
      ActivitySpaceEndeavor[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      ActivitySpaceEndeavor[mxConstants.STYLE_IMAGE] = ActivitySpaceEndeavorPng;
      ActivitySpaceEndeavor[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('ActivitySpaceEndeavor', ActivitySpaceEndeavor);

      var ActivitySpaceCustomer = {};
      ActivitySpaceCustomer[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      ActivitySpaceCustomer[mxConstants.STYLE_IMAGE] = ActivitySpaceCustomerPng;
      ActivitySpaceCustomer[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('ActivitySpaceCustomer', ActivitySpaceCustomer);

      var ActivitySpaceSolution = {};
      ActivitySpaceSolution[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      ActivitySpaceSolution[mxConstants.STYLE_IMAGE] = ActivitySpaceSolutionPng;
      ActivitySpaceSolution[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('ActivitySpaceSolution', ActivitySpaceSolution);

      //Competency Style

      var Competency = {};
      Competency[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      Competency[mxConstants.STYLE_IMAGE] = CompetencyPng;
      Competency[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('Competency', Competency);

      var CompetencyEndeavor = {};
      CompetencyEndeavor[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      CompetencyEndeavor[mxConstants.STYLE_IMAGE] = CompetencyEndeavorPng;
      CompetencyEndeavor[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('CompetencyEndeavor', CompetencyEndeavor);

      var CompetencyCustomer = {};
      CompetencyCustomer[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      CompetencyCustomer[mxConstants.STYLE_IMAGE] = CompetencyCustomerPng;
      CompetencyCustomer[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('CompetencyCustomer', CompetencyCustomer);

      var CompetencySolution = {};
      CompetencySolution[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      CompetencySolution[mxConstants.STYLE_IMAGE] = CompetencySolutionPng;
      CompetencySolution[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('CompetencySolution', CompetencySolution);

      //Work Product Style

      var WorkProduct = {};
      WorkProduct[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      WorkProduct[mxConstants.STYLE_IMAGE] = WorkProductPng;
      WorkProduct[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('WorkProduct', WorkProduct);

      var WorkProductEndeavor = {};
      WorkProductEndeavor[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      WorkProductEndeavor[mxConstants.STYLE_IMAGE] = WorkProductEndeavorPng;
      WorkProductEndeavor[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('WorkProductEndeavor', WorkProductEndeavor);

      var WorkProductCustomer = {};
      WorkProductCustomer[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      WorkProductCustomer[mxConstants.STYLE_IMAGE] = WorkProductCustomerPng;
      WorkProductCustomer[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('WorkProductCustomer', WorkProductCustomer);

      var WorkProductSolution = {};
      WorkProductSolution[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      WorkProductSolution[mxConstants.STYLE_IMAGE] = WorkProductSolutionPng;
      WorkProductSolution[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('WorkProductSolution', WorkProductSolution);

      //Alpha style

      var Alphastyle = {};
      Alphastyle[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      Alphastyle[mxConstants.STYLE_IMAGE] = Alpha;
      Alphastyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
      this.state.graph_global.getStylesheet().putCellStyle('Alpha', Alphastyle);

      var AlphaEndeavor = {};
      AlphaEndeavor[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      AlphaEndeavor[mxConstants.STYLE_IMAGE] = AlphaEndeavorPng;
      AlphaEndeavor[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('AlphaEndeavor', AlphaEndeavor);

      var AlphaCustomer = {};
      AlphaCustomer[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      AlphaCustomer[mxConstants.STYLE_IMAGE] = AlphaCustomerPng;
      AlphaCustomer[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('AlphaCustomer', AlphaCustomer);

      var AlphaSolution = {};
      AlphaSolution[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
      AlphaSolution[mxConstants.STYLE_IMAGE] = AlphaSolutionPng;
      AlphaSolution[mxConstants.STYLE_PERIMETER] =
        mxPerimeter.RectanglePerimeter;
      this.state.graph_global
        .getStylesheet()
        .putCellStyle('AlphaSolution', AlphaSolution);

      // console.log(this.state.graph_global.getStylesheet())

      this.state.graph_global.getModel().beginUpdate();

      try {
        //mxGrapg component
        var doc = mxUtils.createXmlDocument();
        var node = doc.createElement('Node');
        for (var key in this.state.essence_kernel) {
          var component = this.state.essence_kernel[key];

          let a = this.state.graph_global.insertVertex(
            parent,
            component.id,
            component.value,
            component.geometry.x,
            component.geometry.y,
            component.geometry.width,
            component.geometry.height,
            component.style
          );

          a.detail = component.detail;
          this.state.essence_kernel[key] = a;
        }

        for (var key in this.state.edge) {
          var component = this.state.edge[key];

          let source_data = this.state.essence_kernel.filter(function (source) {
            return source.id === component.source;
          })[0];
          let target_data = this.state.essence_kernel.filter(function (source) {
            return source.id === component.target;
          })[0];

          let a = this.state.graph_global.insertEdge(
            parent,
            component.id,
            component.value,
            source_data,
            target_data,
            component.style
          );

          a.detail = component.detail;
          this.state.edge[key] = a;
        }

        // var e1 = graph.insertEdge(
        //     parent,
        //     null,
        //     "",
        //     v1,
        //     v2,
        //     "strokeWidth=2;endArrow=block;endSize=2;endFill=1;strokeColor=blue;rounded=1;"
        // );
        // var e2 = this.state.graph_global.insertEdge(parent, null, "Edge 2", this.state.essence_kernel[0], this.state.essence_kernel[1]);

        //data
      } finally {
        // Updates the display
        this.state.graph_global.getModel().endUpdate();
      }

      // Enables rubberband (marquee) selection and a handler for basic keystrokes
      var rubberband = new mxRubberband(this.state.graph_global);
      var keyHandler = new mxKeyHandler(this.state.graph_global);

      // keyboard backspace hit
      var graph = this.state.graph_global;

      var connectionHandler = new mxConnectionHandler(graph);

      //Handle Connection Edge

      var detail = this;
      var state = this.state;

      graph.connectionHandler.addListener(
        mxEvent.CONNECT,
        function (sender, evt) {
          var edge = evt.getProperty('cell');
          var source = graph.getModel().getTerminal(edge, true);
          var target = graph.getModel().getTerminal(edge, false);

          if (source.detail.type === 'ActivitySpace') {
            graph.getModel().remove(edge);

            alert('Activity Space cannot point to any kernel essence');
          }

          if (
            target.detail.type === 'WorkProduct' &&
            source.detail.type !== 'Activity'
          ) {
            graph.getModel().remove(edge);

            alert('Only Activity can lead to a Work Product');
          }
          //Constrain Untuk Competency
          // console.log('connect '+ edge +' '+ source.id+' '+target.id+' '+sourcePortId+' '+ targetPortId);
          if (
            (source.detail.type === 'Competency' &&
              target.detail.type === 'WorkProduct') ||
            (source.detail.type === 'WorkProduct' &&
              target.detail.type === 'Competency')
          ) {
            graph.getModel().remove(edge);

            alert('Competency and Work Product cannot be interconnected');
          }

          // console.log('connect '+ edge +' '+ source.id+' '+target.id+' '+sourcePortId+' '+ targetPortId);
          if (
            (source.detail.type === 'Competency' &&
              target.detail.type === 'ActivitySpace') ||
            (source.detail.type === 'ActivitySpace' &&
              target.detail.type === 'Competency')
          ) {
            graph.getModel().remove(edge);

            alert('Competency and Activity Space cannot be interconnected');
          }

          if (
            (source.detail.type === 'WorkProduct' &&
              target.detail.type === 'ActivitySpace') ||
            (source.detail.type === 'ActivitySpace' &&
              target.detail.type === 'WorkProduct')
          ) {
            graph.getModel().remove(edge);

            alert(
              'WorkProduct dan Activity Space tidak boleh saling terhubung'
            );
          }

          if (
            source.detail.type === 'Activity' &&
            target.detail.type === 'Competency'
          ) {
            graph.getModel().remove(edge);

            alert('Activity cannot lead to Competency');
          }

          if (
            source.detail.type === 'Activity' &&
            target.detail.type === 'Alpha'
          ) {
            state.edge.push(edge);
            state.essence_kernel
              .filter(function (kernel) {
                return kernel.id === source.id;
              })[0]
              .detail.completionCriterion.alphas.push(target);
          }

          if (
            source.detail.type === 'Activity' &&
            target.detail.type === 'WorkProduct'
          ) {
            state.edge.push(edge);
            state.essence_kernel
              .filter(function (kernel) {
                return kernel.id === source.id;
              })[0]
              .detail.completionCriterion.workProduct.push(target);
          }

          if (
            source.detail.type === 'Alpha' &&
            target.detail.type === 'Activity'
          ) {
            state.edge.push(edge);
            state.essence_kernel
              .filter(function (kernel) {
                return kernel.id === target.id;
              })[0]
              .detail.entryCriterion.alphas.push(source);
          }

          if (
            source.detail.type === 'WorkProduct' &&
            target.detail.type === 'Activity'
          ) {
            state.edge.push(edge);
            state.essence_kernel
              .filter(function (kernel) {
                return kernel.id === target.id;
              })[0]
              .detail.entryCriterion.workProduct.push(source);
          }

          if (
            source.detail.type === 'WorkProduct' &&
            target.detail.type === 'Alpha'
          ) {
            state.edge.push(edge);
            state.essence_kernel
              .filter(function (kernel) {
                return kernel.id === target.id;
              })[0]
              .detail.workProduct.push(source);

            source.detail.area = target.detail.area;

            if (target.detail.area === 'Endeavor') {
              source.style = 'WorkProductEndeavor';
            } else if (target.detail.area === 'Customer') {
              source.style = 'WorkProductCustomer';
            } else if (target.detail.area === 'Solution') {
              source.style = 'WorkProductSolution';
            }

            graph.getModel().beginUpdate();

            try {
              graph.refresh();
            } finally {
              // Updates the display
              graph.getModel().endUpdate();
            }
          }

          if (
            source.detail.type === 'Competency' &&
            target.detail.type === 'Competency'
          ) {
            graph.getModel().remove(edge);

            alert('Competency cannot be interconnected with fellow Competency');
          }

          if (
            source.detail.type === 'Activity' &&
            target.detail.type === 'Activity'
          ) {
            graph.getModel().remove(edge);

            alert('Activities cannot be interconnected with other Activities');
          }

          if (
            source.detail.type === 'ActivitySpace' &&
            target.detail.type === 'ActivitySpace'
          ) {
            graph.getModel().remove(edge);

            alert(
              'Activity Space cannot be interconnected with other Activity Space'
            );
          }

          if (
            source.detail.type === 'Activity' &&
            target.detail.type === 'ActivitySpace'
          ) {
            let sourceAct = state.essence_kernel.filter(function (kernel) {
              return kernel.id === source.id;
            })[0];

            let targetAct = state.essence_kernel.filter(function (kernel) {
              return kernel.id === target.id;
            })[0];

            state.edge.push(edge);

            source.detail.area = target.detail.area;

            if (target.detail.area === 'Endeavor') {
              source.style = 'ActivityEndeavor';
            } else if (target.detail.area === 'Customer') {
              source.style = 'ActivityCustomer';
            } else if (target.detail.area === 'Solution') {
              source.style = 'ActivitySolution';
            }

            targetAct.detail.activity.push(sourceAct);

            graph.getModel().beginUpdate();

            try {
              graph.refresh();
            } finally {
              // Updates the display
              graph.getModel().endUpdate();
            }
          }

          if (
            (source.detail.type === 'Competency' &&
              target.detail.type === 'Alpha') ||
            (source.detail.type === 'Alpha' &&
              target.detail.type === 'Competency')
          ) {
            graph.getModel().remove(edge);

            alert('Competency and Alpha cannot be interconnected');
          }

          if (
            source.detail.type === 'Competency' &&
            target.detail.type === 'Activity'
          ) {
            state.edge.push(edge);
            state.essence_kernel
              .filter(function (kernel) {
                return kernel.id === target.id;
              })[0]
              .detail.competencies.push(source.value.toString());

            source.detail.area = target.detail.area;

            if (target.detail.area === 'Endeavor') {
              source.style = 'CompetencyEndeavor';
            } else if (target.detail.area === 'Customer') {
              source.style = 'CompetencyCustomer';
            } else if (target.detail.area === 'Solution') {
              source.style = 'CompetencySolution';
            }

            graph.getModel().beginUpdate();

            try {
              graph.refresh();
            } finally {
              // Updates the display
              graph.getModel().endUpdate();
            }
          }

          if (
            source.detail.type === 'Alpha' &&
            target.detail.type === 'Alpha'
          ) {
            let sourceAlpha = state.essence_kernel.filter(function (kernel) {
              return kernel.id === source.id;
            })[0];

            let targetAlpha = state.essence_kernel.filter(function (kernel) {
              return kernel.id === target.id;
            })[0];

            if (targetAlpha.detail.isSubAlpha) {
              graph.getModel().remove(edge);

              alert('Alpha cannot be a sub Alpha of a sub Alpha');
            } else if (sourceAlpha.detail.hasSubAlpha) {
              graph.getModel().remove(edge);

              alert('Alpha already has a sub Alpha');
            } else {
              sourceAlpha.detail.isSubAlpha = true;
              targetAlpha.detail.hasSubAlpha = true;
              state.edge.push(edge);
              targetAlpha.detail.subAlpha.push(sourceAlpha);

              source.detail.area = target.detail.area;

              if (target.detail.area === 'Endeavor') {
                source.style = 'AlphaEndeavor';
              } else if (target.detail.area === 'Customer') {
                source.style = 'AlphaCustomer';
              } else if (target.detail.area === 'Solution') {
                source.style = 'AlphaSolution';
              }
            }

            graph.getModel().beginUpdate();

            try {
              graph.refresh();
            } finally {
              // Updates the display
              graph.getModel().endUpdate();
            }
          }
        }
      );

      // keyboard enter hit
      keyHandler.bindKey(13, function () {
        if (graph.isEnabled()) {
          if (graph.getSelectionCell()) {
            let data = graph.getSelectionCell();
            let kernel_data_detail = state.essence_kernel.filter(function (
              kernel
            ) {
              return kernel.id === graph.getSelectionCell().id;
            });
            console.log(data);
            console.log(kernel_data_detail);
            if (kernel_data_detail != undefined) {
              detail.detail_data = kernel_data_detail[0];
              detail.openModal();
            }
          }
        }
      });

      // keyboard backspace hit
      keyHandler.bindKey(8, function () {
        if (graph.isEnabled()) {
          var kernel = graph.getSelectionCell();
          state.essence_kernel = state.essence_kernel.filter(function (ele) {
            return ele.id !== kernel.id;
          });
          if (kernel.detail.type === 'Competency') {
            let as = state.essence_kernel.filter(function (ele) {
              return ele.detail.type === 'Activity';
            });

            for (var i = 0; i < as.length; i++) {
              as[i].detail.competencies = as[i].detail.competencies.filter(
                function (competency) {
                  return competency !== kernel.value;
                }
              );
            }
          }

          if (kernel.detail.type == 'Alpha') {
            let as = state.essence_kernel.filter(function (ele) {
              return ele.detail.type === 'Activity';
            });

            if (kernel.detail.isSubAlpha) {
              let alphas = state.essence_kernel.filter(function (ele) {
                return ele.detail.type === 'Alpha' && !ele.detail.isSubAlpha;
              });
              for (var i = 0; i < alphas.length; i++) {
                alphas[i].detail.subAlpha = alphas[i].detail.subAlpha.filter(
                  function (alpha) {
                    return alpha.id !== kernel.id;
                  }
                );
              }
            }

            for (var i = 0; i < as.length; i++) {
              as[i].detail.completionCriterion.alphas = as[
                i
              ].detail.completionCriterion.alphas.filter(function (alpha) {
                return alpha.id !== kernel.id;
              });
            }

            for (var i = 0; i < as.length; i++) {
              as[i].detail.entryCriterion.alphas = as[
                i
              ].detail.entryCriterion.alphas.filter(function (alpha) {
                return alpha.id !== kernel.id;
              });
            }
          }

          if (kernel.detail.type == 'Activity') {
            let as = state.essence_kernel.filter(function (ele) {
              return ele.detail.type === 'ActivitySpace';
            });

            for (var i = 0; i < as.length; i++) {
              as[i].detail.activity = as[i].detail.activity.filter(function (
                activity
              ) {
                return activity.id !== kernel.id;
              });
            }
          }
          graph.removeCells();
        }
      });

      // keyboard delete hit
      keyHandler.bindKey(46, function (evt) {
        if (graph.isEnabled()) {
          var kernel = graph.getSelectionCell();
          state.essence_kernel = state.essence_kernel.filter(function (ele) {
            return ele.id !== kernel.id;
          });
          graph.removeCells();
        }
      });

      // keyboard Left Arrow hit
      keyHandler.bindKey(37, function (evt) {
        if (graph.isEnabled()) {
          graph.getModel().beginUpdate();

          try {
            graph.translateCell(graph.getSelectionCell(), -10, 0);
          } catch (e) {
            console.log(e);
          } finally {
            // Updates the display
            graph.getModel().endUpdate();
          }
        }
      });

      // keyboard Up Arrow hit
      keyHandler.bindKey(38, function (evt) {
        if (graph.isEnabled()) {
          graph.getModel().beginUpdate();

          try {
            //let editedCell = new mxCell(null,geometry,graph.getSelectionCell().getStyle());
            graph.translateCell(graph.getSelectionCell(), 0, -10);
          } catch (e) {
            console.log(e);
          } finally {
            // Updates the display
            graph.getModel().endUpdate();
          }
        }
      });

      // keyboard Right Arrow hit
      keyHandler.bindKey(39, function (evt) {
        if (graph.isEnabled()) {
          graph.getModel().beginUpdate();

          try {
            //let editedCell = new mxCell(null,geometry,graph.getSelectionCell().getStyle());
            graph.translateCell(graph.getSelectionCell(), 10, 0);
          } catch (e) {
            console.log(e);
          } finally {
            // Updates the display
            graph.getModel().endUpdate();
          }
        }
      });

      // keyboard Down Arrow hit
      keyHandler.bindKey(40, function (evt) {
        if (graph.isEnabled()) {
          graph.getModel().beginUpdate();

          try {
            //let editedCell = new mxCell(null,geometry,graph.getSelectionCell().getStyle());
            graph.translateCell(graph.getSelectionCell(), 0, 10);
          } catch (e) {
            console.log(e);
          } finally {
            // Updates the display
            graph.getModel().endUpdate();
          }
        }
      });

      var undoManager = new mxUndoManager();
      console.log(undoManager);
      var listener = function (sender, evt) {
        // console.log(sender.cells)
        undoManager.undoableEditHappened(evt.getProperty('edit'));
      };
      graph.getModel().addListener(mxEvent.UNDO, listener);
      graph.getView().addListener(mxEvent.UNDO, listener);
    }
  }

  render() {
    const { classes } = this.props;
    if (!this.state.loading) {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                className={classes.logo}
              >
                <Link href="/" color="inherit">
                  Essence editor
                </Link>
              </Typography>
              <Button
                variant="contained"
                onClick={this.toJSON}
                className={classes.btn}
              >
                Export to JSON...
              </Button>
              <Button
                variant="contained"
                onClick={this.saveData}
                className={classes.btn}
              >
                Save to DB
              </Button>
            </Toolbar>
          </AppBar>

          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar} />
            <List>
              <ListItem button onClick={this.addAlpha}>
                <img src={Alpha} alt="" />
              </ListItem>
              <ListItem button onClick={this.addActivity}>
                <img src={ActivityPng} alt="" />
              </ListItem>
              <ListItem button onClick={this.addActivitySpace}>
                <img src={ActivitySpacePng} alt="" />
              </ListItem>
              <ListItem button onClick={this.addCompetency}>
                <img src={CompetencyPng} alt="" />
              </ListItem>
              <ListItem button onClick={this.addWorkProduct}>
                <img src={WorkProductPng} alt="" />
              </ListItem>
            </List>
          </Drawer>
          <div className={classes.content}>
            <div className={classes.toolbar} />
            <div
              className={classes.graphContainer}
              ref="divGraph"
              id="divGraph"
            />
          </div>

          <Modal
            open={this.state.openForm}
            onClose={this.handleClose.bind(this)}
          >
            <KernelDetail
              essence_kernels={this.state.essence_kernel}
              essence_kernel={this.detail_data}
              graph_global={this.state.graph_global}
              closeForm={this.handleClose.bind(this)}
            />
          </Modal>
        </div>
      );
    } else {
      return <div> Loading</div>;
    }
  }
}
export default withStyles(styles, { withTheme: true })(Editor);
