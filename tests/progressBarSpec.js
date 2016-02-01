
var name = 'progress1';
var name2 = 'name2';
var precision = 0;
var toIncrementByDefault = function(progressBar,name){
    expect(progressBar.increment(name).getPercentage()).toBe('10');
    expect(progressBar.increment(name).getPercentage()).toBe('20');
    expect(progressBar.increment(name).getPercentage()).toBe('30');
    expect(progressBar.increment(name).getPercentage()).toBe('40');
    expect(progressBar.increment(name).getPercentage()).toBe('50');
    expect(progressBar.increment(name).getPercentage()).toBe('55');
    expect(progressBar.increment(name).getPercentage()).toBe('60');
    expect(progressBar.increment(name).getPercentage()).toBe('65');
    expect(progressBar.increment(name).getPercentage()).toBe('70');
    expect(progressBar.increment(name).getPercentage()).toBe('75');
    expect(progressBar.increment(name).getPercentage()).toBe('78');
    expect(progressBar.increment(name).getPercentage()).toBe('80');
};
var toIncrementLinearly = function(progressBar,name,maxScore){
    expect(progressBar.increment(name).getPercentage()).toBe((100/maxScore).toFixed(precision));
    expect(progressBar.increment(name).getPercentage()).toBe((200/maxScore).toFixed(precision));
    expect(progressBar.increment(name).getPercentage()).toBe((300/maxScore).toFixed(precision));
    expect(progressBar.increment(name).getPercentage()).toBe((400/maxScore).toFixed(precision));
    expect(progressBar.increment(name).getPercentage()).toBe((500/maxScore).toFixed(precision));
    expect(progressBar.increment(name).getPercentage()).toBe((100).toFixed(precision));
};

describe('progressBarSpec', function() {
    var progressBar;

    beforeEach(function(){
        spyOn(console,'error');
        spyOn(console,'log');
        spyOn(console,'info');
    });

    describe('to create a sub progress progress1', function() {

        beforeEach(function() {
            progressBar = new ProgressBar();
        });

        it('before that, there should be no sub progress progress1',function(){
            expect(function(){progressBar.increment(name);}).toThrow(new Error('Progress with name "' + name + '" is not defined.'));
        });

        describe('it should be able to set the parameters individually',function(){

            it('it should be able to set and use setted hooks, both defined and that as window variable',function(){
                var hooks = {};
                hooks['progressBar:complete:' + name] = function(){
                    console.log(name + ' is completed');
                };

                progressBar = new ProgressBar({
                    hooks: hooks
                })
                .createNewProgress({
                    name: name
                })
                .createNewProgress({
                    name: name2
                })
                .complete(name);
                expect(console.log).toHaveBeenCalledWith(name + ' is completed');

                window.hooks = {};
                window.hooks['progressBar:complete:' + name2] = function(){
                    console.log(name2 + ' is now completed');
                };
                progressBar.complete(name2);
                expect(console.log).toHaveBeenCalledWith(name2 + ' is now completed');
            });

            it('it should be able to set precision, e.g. 5',function(){
                progressBar = new ProgressBar({
                    precision: 5
                })
                .createNewProgress({
                    name: name
                });
                expect(progressBar.increment(name).getPercentage()).toBe('10.00000');
            });

            /*
            it('it should be able to set model',function(){
                //jasmine.loadFixtures('myfixture.html');
                var div = $('<div class="progressBarModel"><span class="percentage"></span></div>');
                $(document.body).append(div);
                progressBar = new ProgressBar({
                    model: '.progressBarModel'
                })
                .createNewProgress({
                    name: name
                });
                progressBar.increment(name);
                expect($('.percentage')[0]).toBeInDOM();
            });
            */

        });

        describe('it should be able to be created with only a name',function(){
            beforeEach(function(){
                progressBar.createNewProgress({
                    name: name
                });
            });

            it('it should use default incrementation',function(){
                toIncrementByDefault(progressBar,name);
            });

            it('it should not be able to create a new progress if already incremented',function(){
                var name2 = 'progress2';
                progressBar.increment(name);
                progressBar.createNewProgress({
                    name: name2
                });
                expect(function(){progressBar.increment(name2);}).toThrow(new Error('Progress with name "' + name2 + '" is not defined.'));
            });

            it('it should be able to be completed, not be able to create a new progress, and can be reset', function() {
                var name2 = 'progress2';
                expect(progressBar.complete(name).getPercentage()).toBe('100');
                progressBar.createNewProgress({
                    name: name2
                });
                expect(function(){progressBar.increment(name2);}).toThrow(new Error('Progress with name "' + name2 + '" is not defined.'));
                expect(function(){progressBar.reset().increment(name);}).toThrow(new Error('Progress with name "' + name + '" is not defined.'));
            });
        });

        describe('it should be able to create a linearly incremented progress',function(){
            beforeEach(function(){
                progressBar.createNewProgress({
                    name: name,
                    incrementLinearly: true,
                    maxScore: 5,
                    weight: 40
                });
            });

            it('it should use default incrementation',function(){
                toIncrementLinearly(progressBar,name,5);
            });

            it('if 2 sub progresse, it should be incremented correctly',function(){
                progressBar.createNewProgress({
                    name: name2,
                    weight: 60
                });
                expect(progressBar.increment(name).getPercentage()).toBe('8');
            });

            it('if 2 sub progresse, it should be incremented correctly, even if maxScore is not set for linear, and initStepSize defined for the default',function(){
                progressBar.createNewProgress({
                    name: name,
                    incrementLinearly: true,
                    weight: 20
                })
                .createNewProgress({
                    name: name2,
                    weight: 30,
                    initStepSize: 2
                });
                expect(progressBar.increment(name).getPercentage()).toBe('2');
                expect(progressBar.increment(name2).getPercentage()).toBe('6');
            });
        });

    });

});
