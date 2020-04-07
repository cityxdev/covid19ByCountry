const initModal = function(modalElement){
    $('.close',modalElement).click(function () {
        $($(this).parents('div.modal')[0]).trigger('close');
    });

    modalElement.bind('open',function () {
        $(this).show();
        $(this).data('isOpen',true);
        $('body').addClass('modal-open');
        if($(this).data('onOpen') && isFunction($(this).data('onOpen')))
            $(this).data('onOpen')();

    });
    modalElement.bind('close',function () {
        $(this).hide();
        $(this).data('isOpen',false);
        $('body').removeClass('modal-open');
        if($(this).data('onClose') && isFunction($(this).data('onClose')))
            $(this).data('onClose')();
    });
};



$(function () {
    $('div.modal').each(function () {
        initModal($(this));
    });

    $(document).keyup(function(event) {
        if (event.keyCode === 27){//esc
            let closed = false;
            $('div.modal').each(function () {
                if($(this).data('isOpen')) {
                    $(this).trigger('close');
                    closed=true;
                }
            });
            if(closed) {
                event.preventDefault();
                return false;
            }
        }
    });

});