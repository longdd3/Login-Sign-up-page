class AppForm{
    constructor() {
        this.form = [];
        this.step = 0;
        this.currentGroup = null;
        
        this.setListeners();
        this.getForm();
        document.getElementById('next-button').disabled = true;

        this.refresh();
        this.check();
        this.pageType = window.location.href.includes('index') ? 'index' : 'signup';
    }

    submit = () => {
        const un = document.getElementById('email-input').value;
        const pw = document.getElementById('password-input').value;

        if(this.pageType === 'index'){
            firebase.auth().signInWithEmailAndPassword(un,pw).then(res => {
                document.getElementById('error-massage').innerHTML = '';
                window.location.href = 'loggined.html#' + res.user.email;

            },
                err => {
                    document.getElementById('error-massage').innerHTML = 'Incorrect Login Info.';
                 });
        } else if (this.pageType === 'signup')
        {
            firebase.auth().createUserWithEmailAndPassword(un,pw).then(res =>{
            window.location.href = 'loggined.html#' + res.user.email;
            });
        }
    }
    currentInput =() => this.form[this.step -1 ].input;
    previousInput = () => this.form[this.step -2].input;


    check = () => this.currentInput().addEventListener('keyup', this.enableDisable);
    enableDisable =() =>{
        if (this.valid(this.currentInput()))
        {
            this.currentInput().classList.remove('invalid');
            this.setListeners();
            document.getElementById('next-button').disabled = false;

        }
        else {
            this.currentInput().classList.add('invalid');
            this.removeListeners();
            document.getElementById('next-button').disabled = true;

        }
    }
    goBack =() => {
        if (this.step >1){
            this.currentInput().value ='';
            this.step--;
            this.displayStep();
            this.enableDisable();
        }
    }
    valid = (input) => {
        const formType = input.id;
        const value = input.value;
        const empty = (str) => !str.split('').every(_char => _char !=='');
        if (!value || empty(value)) return false;

        if (this.pageType === 'index' ) return value && !empty(value);

        switch(formType){
            case 'email-input':
                //regular Expression
               return /\S+@\S+\.\S+/.test(value);
            case 'email-vertification-input':
               return this.previousInput().value === value;
            case 'password-input':
                return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9@$&!]{8,}/.test(value);


            case 'passsword-vertification-input':
                return this.previousInput().value === value;            
            default:
                return false;
        }
    };

    refresh = () => {
        this.step++;
        if (this.step <= this.form.length){
        this.displayStep();
        this.removeListeners();
        document.getElementById('next-button').disabled = true;
        this.check();
        }

        else
        this.submit();
    }
    displayStep =()=> {
        if (this.currentGroup)
        this.currentGroup.style.display = 'none';
        this.currentGroup = this.form.find(_group => _group.step === this.step).element;
        this.currentGroup.style.display = 'block';
    }
    getForm = () => {
        const groups = Array.from(document.getElementsByClassName('form-group'));
        groups.forEach(_group => {
            const children  = Array.from(_group.children);
            this.form.push({
                'step' : Number.parseInt(_group.dataset.step),
                'element' : _group,
                'input': children.find(_el => _el.nodeName == 'INPUT')
            });
        });

    }
    setListeners = () => {
        document.getElementById('next-button').addEventListener('click', this.refresh);
        document.getElementById('back-button').addEventListener('click', this.goBack);

    }
    removeListeners = () => {
        document.getElementById('next-button').removeEventListener('click', this.refresh);

    }
}
new AppForm();