<script type="text/html" id="template-name">
<div id="tc_ec_step1">
    <input id="name" type="text" class="form-control" placeholder="name of the article" data-bind="value: articleDetails.name"/><br>
    <input id="tags" type="text" class="form-control"  placeholder="tags for this article" data-bind="value: articleDetails.tags"/><br>
    <textarea class="form-control" rows="3" id="zist"  placeholder="brief zist of the article" data-bind="value: articleDetails.zist"></textarea>
    <br>
    <button class="btn btn-lg btn-primary btn-block" type="submit" onclick="javascript: return tc.onNameNextClick();">Next</button>
</div>
</script>