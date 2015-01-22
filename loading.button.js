function LoadingButton(element, data_color, use_progress_bar) {
    //Self
    var me = this;

    //Defaults
    var DEFAULT_DATA_COLOR = '#fff';

    //Current values
    var active_data_color = data_color ? data_color : DEFAULT_DATA_COLOR;
    var active_progress = 0;
    var active_button = element;
    var active_button_default_text = element.html();
    var active_interval = null;
    var use_progress = use_progress_bar == null ? false : use_progress_bar;

    //Create the progress label for this button if we plan to show it
    var progress_label = use_progress == true ? $('<div class="lw-progress"></div>').appendTo(element) : null;
    
    //Messages
    var message_fail = "Failed";
    var message_success = "Success";
    var alert_message = "Alert";

    //Add the onclick to start the progress loop
    active_button.on('click', function() {
        me.Start({
            callback: function() {
                active_interval = setInterval(function() {
                    active_progress = active_progress + LOADING_BUTTON_PROGRESS_INCREMENT;
                    me.Progress(active_progress)

                }, LOADING_BUTTON_PROGRESS_DELAY);
            }
        });
    });
    
    //The looping process used to increase the width of the progress div
    this.Progress = function (progress) {
        active_progress = progress;
        //going beyond 100% so it 
        if (active_progress > LOADING_BUTTON_MAX_PROGRESS_PERCENT) {
            active_progress = 0;
            clearInterval(active_interval);
        }
        $(active_button).find(progress_label).width((active_progress) + '%');
    };

    //Stops the running of the loop
    this.Stop = function () {
        //Kills the looping
        clearInterval(active_interval);
        active_progress = 0;

        $(active_button).removeAttr('disabled');
        $(active_button).removeAttr('data-loading');
        $(active_button).removeClass('loading-started');
    };

    //Starts the looping process
    this.Start = function (options) {
        //If we are calling start directly without a click event, then trigger
        //the callback here
        options = options || {};

        $(active_button).attr('disabled', '');
        $(active_button).attr('data-loading', '');
        $(active_button).addClass('loading-started');
        $(active_button).find('.lw-label').html('');

        // Invoke callbacks
        if (typeof options.callback === 'function' && use_progress) {
            options.callback.apply(null);
        }
    };

    this.Fail = function(message) {
        $(active_button).attr('data-color', 'lw-decline');
        $(active_button).children('.lw-label').html(message ? message : message_fail);
        //Kills the looping
        me.Stop();
    };

    this.Success = function (message) {
        //Kills the looping
        me.Stop();

        $(active_button).attr('data-color', 'lw-login');
        $(active_button).children('.lw-label').html(message ? message : message_success);
    };

    this.Alert = function (message) {
        $(active_button).attr('data-color', 'lw-alert');
        $(active_button).children('.lw-label').html(message ? message : alert_message);
        //Kills the looping
        me.Stop();
    };

    //Resets the loading button text back to its original state
    //<param>delay : delay before the state is reset
    this.Reset = function (delay) {
        var resetTextDelay = setInterval(function () {
            //Sets the text back to whatever it was before we started the loading
            $(active_button).html(active_button_default_text);
            clearInterval(resetTextDelay);
        }, delay == null ? 0 : delay);
    };
}