// ==================================================
// API HANDLER CLASS
// ==================================================

export class API
{
    constructor () 
    {
        this.base = window.location.origin;
        this.csrf = document.querySelector('meta[name="csrf-token"]').content;
        this.update_csrf();
    }



    auth_check () 
    {
        return this.fetch(this.base+'/api/user/auth_check', 'GET', {}).then(res => res.json());
    }

    // === USER ===

    login (data) 
    {
        return this.fetch(this.base+'/login', 'POST', data).then(res => res.json());
    }

    logout () 
    {
        return this.fetch(this.base+'/logout', 'POST', {});
    }

    register (data) 
    {
        return this.fetch(this.base+'/register', 'POST', data).then(res => res.json());
    }

    reset (data) 
    {
        return this.fetch(this.base+'/forgot-password', 'POST', data).then(res => res.json());
    }
    
    getUser () 
    {
        return this.fetch(this.base+'/api/user', 'GET', {}).then(res => res.json());
    }

    // === USERSSUBMODULE ===

    usersubmodule_create (data) 
    {
        return this.fetch(this.base+'/api/user_submodule', 'POST', data).then(res => res.json());
    }

    usersubmodule_read (id) 
    {
        this.fetch(this.base+'/api/user_submodule/'+id, 'GET');
    }
    
    usersubmodule_update (id, data) 
    {
        this.fetch(this.base+'/api/user_submodule/'+id, 'PUT', data);
    }

    usersubmodule_delete (id) 
    {
        this.fetch(this.base+'/api/user_submodule/'+id, 'DELETE', {});
    }

    // === LEADERBOARD ===

    leaderboard_byModule ($module_key, page=1) 
    {
        return this.fetch(this.base+'/api/leaderboard/by/'+$module_key+'?page='+page, 'GET')
            .then(res => res.json());
    }

    leaderboard_bySubmodule ($module_key, $submodule_key, page=1) 
    {
        return this.fetch(this.base+'/api/leaderboard/by/'+$module_key+'/'+$submodule_key
            +'?page='+page, 'GET').then(res => res.json());
    }

    leaderboard_overall (page=1) 
    {
        return this.fetch(this.base+'/api/leaderboard/overall?page='+page, 'GET')
            .then(res => res.json());
    }

    // === PROGRESS ===

    progress_byModule ($module_key) 
    {
        return this.fetch(this.base+'/api/progress/by/'+$module_key, 'GET')
            .then(res => res.json());
    }

    progress_overall () 
    {
        return this.fetch(this.base+'/api/progress/overall', 'GET')
            .then(res => res.json());
    }

    progress_status_byModule ($module_key) 
    {
        return this.fetch(this.base+'/api/progress/status/by/'+$module_key, 'GET')
            .then(res => res.json());
    }

    progress_status_overall ($module_key) 
    {
        return this.fetch(this.base+'/api/progress/status/overall', 'GET')
            .then(res => res.json());
    }



    update_csrf (callback=()=>{}) 
    {
        return this.fetch(this.base+'/sanctum/csrf-cookie', 'GET').then(response => { 
            var cookies = document.cookie.split(";");
            
            for (let i=0; i<cookies.length; i++) {
                let cookie = cookies[i].split("=");
                if (cookie[0].trim() === 'XSRF-TOKEN') {
                    this.csrf = decodeURIComponent(cookie[1]);
                    i+=cookies.length;
                }
            }
        });
    }
    
    fetch (endpoint, method, data={}) 
    {
        // Callback parameter (response)
        let settings = {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': this.csrf
            },
        }
        if (method !== 'GET') settings.body = JSON.stringify(data);
        return fetch(endpoint, settings);
    }
}
