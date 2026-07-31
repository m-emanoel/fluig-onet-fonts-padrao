const roles = {
		
		/* -------------------------- VIEW/CONTROL ----------------------------*/
		addObriga: (classe) => {
			$("." + classe).addClass("required");
		},
		
		removeObriga: (classe) => {
			$("." + classe).removeClass("required");
		},
		
		hideClass: (classe) => {
			$("." + classe).hide();
		},
		
		showClass: (classe) => {
			$("." + classe).show();
		},
		
		addBloq: (classe) => {
			$("." + classe).attr("readonly", "readonly").css("pointer-events", "none");
		},
		
		removeBloq: (classe) => {
			$("." + classe).removeAttr("readonly").css("pointer-events", "auto");
		},
		
		addDisabled: (classe) => {
			$("." + classe).css("pointer-events", "none");
		},
		
		removeDisabled: (classe) => {
			$("." + classe).css("pointer-events", "auto");
		},
		
		removeClass: (classe) => {
			$("." + classe).removeClass(classe);
		},
		
		loading: FLUIGC.loading(window),

		alertTI: (classe) => {
			FLUIGC.toast({title: 'Erro: ', message: 'Ocorreu um problema. Entre em contato com o TI.', type: 'danger'})
		},
	
		UPPERCASE: (campo) => {
			$(campo).val(campo.val().toUpperCase());
		},
		
		/* -------------------------- ZOOM ----------------------------*/
		
		/*
		 * FILTRA ZOOM
		 */
		reloadZoom: (id, el) => {
			reloadZoomFilterValues(id, el);
		},
		
		/*
		 * DESABILITA ZOOM
		 */
		disableZoomFields: (fields) => {
			fields.forEach(function (field) {
				
				const zoomField = window[field];
				
			    if (zoomField && zoomField.disable) {
			    	
			    	zoomField.disable(true);
			    }else {
			    	
			    	setTimeout(function () {
			    		roles.disableZoomFields([field]);
			    	}, 100);
			    }
			});
		},
		
		/* ------------------- TABELA ------------------- */
		
		/*
		 * ADICIONA LINHA EM TABELA
		 */
		addLinha: (tablename) => {
			return wdkAddChild(tablename);
		},
		
		/* ------------------- DATASET ------------------- */
		
		/*
         * BUSCA DATASET PROMISE
         */
		getDatasetPromise: (datasetid, constraint) => {

		    return new Promise((resolve, reject) => {

		        try {

		            constraint = constraint || [];

		            constraint.push(DatasetFactory.createConstraint("userSecurityId", "admin", "admin", ConstraintType.MUST));

		            var dataset = DatasetFactory.getDataset(datasetid,null,constraint,null);

		            //VALIDA SE O DATASET RETORNOU VALORES
		            if (!dataset || !dataset.values) {

		                reject('Dataset vazio');

		                return;
		            }

		            resolve(dataset.values);

		        } catch (e) {

		        	//ABRE AVISO
	            	FLUIGC.toast({
	                    title: 'Erro: ',
	                    message: 'Ocorreu um problema. Entre em contato com o TI.',
	                    type: 'danger'
	                });

	                console.log('Erro ao buscar dataset ' + datasetid + '.');
	                console.log(dataset);
	                
	                resolve([]);
		        }
		    });
		},
		
		/*
		 * BUSCA DATASET
		 */
		getDataset: (datasetid, constraint) => {
			
			constraint = constraint || [];

            constraint.push(DatasetFactory.createConstraint("userSecurityId", "admin", "admin", ConstraintType.MUST));
        	
        	var dataset = DatasetFactory.getDataset(datasetid, null, constraint, null);
        	
        	//VALIDA SE O DATASET RETORNOU VALORES
            if (!dataset || !dataset.values) {
            	
            	//ABRE AVISO
            	FLUIGC.toast({
                    title: 'Erro: ',
                    message: 'Ocorreu um problema. Entre em contato com o TI.',
                    type: 'danger'
                });

                console.log('Erro ao buscar dataset ' + datasetid + '.');
                console.log(dataset);
                
                return [];
            }

            return dataset.values;
		},
		
		/*
		 * BUSCA VERSÃO ATIVA DE DOCUMENTO
		 */
		getVersionActive: function (docId) {
			
			var constraint = [
				DatasetFactory.createConstraint("documentPK.documentId", docId, docId, ConstraintType.MUST),
				DatasetFactory.createConstraint("activeVersion", true, true, ConstraintType.MUST)
			];
			
			var dsdoc = roles.getDataset("document", constraint);

			return (dsdoc != null && dsdoc.values.length > 0) ? dsdoc.values[0]["documentPK.version"] : "1000";
		},
		

        /*
         * VERIFICA SE USUARIO FAZ PARTE DO GRUPO
         */
        isUserInGroup: function(user, group) {
        	var constraint = [
                DatasetFactory.createConstraint("matricula", user, user, ConstraintType.MUST),
                DatasetFactory.createConstraint("grupo", group, group, ConstraintType.MUST)
            ];
            
            //BUSCA GRUPO
            var dsgrupo = roles.getDataset("ds_busca_users_group", constraint);
	    	
	    	return dsgrupo.length > 0;
        },
}
