ko.bindingHandlers.launchPopUp = {
    'update': function(element, valueAccessor) {
        $(element).hide();
        ko.bindingHandlers.text.update(element, valueAccessor);
        $(element).fadeIn('slow');
    }
};