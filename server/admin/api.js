const router = require("express").Router(),
  util = require("../common/util.js");

router.route("/dataItemapply/getDataItemApplies")
  .post(function (request, response) {
    let datas = {};
    var pageNum = request.query.pageNum;
    if (2 == pageNum) {
      datas = util.json("/admin/data/dataitem_applyList_appliedDataSetList2.json");
    } else {
      datas = util.json("/admin/data/dataitem_applyList_appliedDataSetList1.json");
    }
    response.json(datas);
  });
router.route("/dataItemapply/getDataItemApplies")
  .post(function (request, response) {
    response.json(util.json("/admin/data/dataitem_applyList_applyInfoSetItems.json"));
  });
router.route("/dataRate/getDataRates")
  .post(function (request, response) {
    response.json(util.json("/admin/data/dataset_rating_list.json"));
  });
router.route("/dataCollection/getDataCollections")
  .post(function (request, response) {
    response.json(util.json("/admin/data/dataCollection_dataCollectionList_getDataCollectionList.json"));
  });
router.route("/dataCorrection/getDataCorrections")
  .post(function (request, response) {
    response.json(util.json("/admin/data/dataCorrection_dataCorrectionList_getDataCorrectionList.json"));
  });
  router.route("/home/myRequirementList")
  .post(function (request, response) {
    response.json(util.json("/admin/data/home_myRequirementList.json"));
  });
module.exports = router;
