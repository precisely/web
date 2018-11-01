# What is ME/CFS?		

[Myalgic Encephalopathy Chronic Fatigue Syndrome (ME/CFS)](https://www.cdc.gov/me-cfs/index.html) is a mysterious condition where overwhelming fatigue prevents people from doing their normal, daily activities. This fatigue is not improved by rest and is worsened by exertion. It’s important to note that sufferers of ME/CFS may not appear ill.
					
# What causes ME/CFS?

[Doctors don't know what causes ME/CFS](https://www.cdc.gov/me-cfs/index.html), so patients are diagnosed based on their symptoms and medical history. For many people, symptoms start after a viral illness. In some cases, it seems to follow a major physical or emotional trauma or exposure to toxins. In addition, it is possible that two or more triggers might work together to cause the illness. There is no single known cause of ME/CFS.

# Genes related to ME/CFS

We've assembled this list of genes and variants based on research publications implicating their association with ME/CFS and symptoms common to ME/CFS.


<IndicatorPanel normal="normal (wildtype)" 
                abnormal="contains variants" 
                default="abnormal"> 
  <Indicator icon="gene" name="MTHFR" link="/report/mthfr" require={
      variantCall("NC_000001.10:g.11856378") and
      variantCall("NC_000001.10:g.11854476")
    } 
    normal={
    variantCall("NC_000001.10:g.[11856378=];[11856378=]") and 
    variantCall("NC_000001.10:g.[11854476=];[11854476=]")
    } />
    
  <Indicator icon="gene" name="CHRN5A" link="/report/chrn5a" require={
      variantCall("NC_000015.9:g.78882925") and 
      variantCall("NC_000015.9:g.78865893") and 
      variantCall("NC_000015.9:g.78873993") 
    }
    normal={
      variantCall("NC_000015.9:g.[78882925=];[78882925=]") and 
      variantCall("NC_000015.9:g.[78865893=];[78865893=]") and 
      variantCall("NC_000015.9:g.[78873993=];[78873993=]") 
    } />
   <Indicator icon="gene" name="CHRNA2" link="/report/chrna2" require={
      variantCall("NC_000008.10:g.27321124") and 
      variantCall("NC_000006.11:g.12727715") and 
      variantCall("NC_000008.10:g.27328511") and
      variantCall("NC_000008.10:g.27326127") and
      variantCall("NC_000008.10:g.27324822") 
    }
    normal={
      variantCall("NC_000008.10:g.[27321124=];[27321124=]") and 
      (variantCall("NC_000006.11:g.[12727715A>G];[12727715A>G]") or variantCall("NC_000006.11:g.[12727715A>G];[12727715=]") )      and 
      (variantCall("NC_000008.10:g.[27328511G>A];[27328511G>A]") OR variantCall("NC_000008.10:g.[27328511G>A];[27328511=]") )      and
      (variantCall("NC_000008.10:g.[27326127A>G];[27326127=]") OR variantCall("NC_000008.10:g.[27326127=];[27326127=]") )      and
      (variantCall("NC_000008.10:g.[27324822T>C];[27324822T>C]") OR variantCall("NC_000008.10:g.[27324822T>C];[27324822=]") )
    } />
   <Indicator icon="gene" name="CHRNA3" link="/report/chrna3" require={
      variantCall("NC_000015.9:g.78898723") and
      variantCall("NC_000015.9:g.78894339")
    } 
    normal={
    variantCall("NC_000015.9:g.[78898723=];[78898723=]") and 
    variantCall("NC_000015.9:g.[78894339=];[78894339=]")
    } />
  <Indicator icon="gene" name="CHRNB4" link="/report/chrnb4" require={
      variantCall("NC_000015.9:g.78923987") and 
      variantCall("NC_000015.9:g.78928264") and 
      variantCall("NC_000015.9:g.78930510") 
    }
    normal={
      variantCall("NC_000015.9:g.[78923987=];[78923987=]") and 
      (variantCall("NC_000015.9:g.[78928264G>T];[78928264=]") OR variantCall("NC_000015.9:g.[78928264=];[78928264=]") )      and
      (variantCall("NC_000015.9:g.[78930510A>G];[78930510A>G]") OR variantCall("NC_000015.9:g.[78930510=];[78930510=]") ) 
    } />   
  <Indicator icon="gene" name="CLYBL" link="/report/clybl" require={
      variantCall("NC_000013.10:g.100518634") 
    }
    normal={
      variantCall("NC_000013.10:g.[100518634=];[100518634=]")
    } />   
  <Indicator icon="gene" name="COMT" link="/report/comt" require={
      variantCall("NC_000022.10:g.19931407") and 
      variantCall("NC_000022.10:g.19948337") and 
      variantCall("NC_000022.10:g.19937533") and
      variantCall("NC_000022.10:g.19951271") and
      variantCall("NC_000022.10:g.19950235") 
    }
    normal={
      variantCall("NC_000022.10:g.[19931407=];[19931407=]") and 
      variantCall("NC_000022.10:g.[19937533=];[19937533=]") and
      variantCall("NC_000022.10:g.[19950235=];[19950235=]")
    } />   
  <Indicator icon="gene" name="CRHR1" link="/report/crhr1" require={
      variantCall("NC_000017.10:g.43892600") and
      variantCall("NC_000017.10:g.43902997")
    } 
    normal={
    variantCall("NC_000017.10:g.[43892600=];[43892600=]") and 
    variantCall("NC_000017.10:g.[43902997=];[43902997=]")
    } />   
  <Indicator icon="gene" name="DRD2" link="/report/drd2" require={
      variantCall("NC_000011.9:g.113346251") and 
      variantCall("NC_000011.9:g.113283484") and 
      variantCall("NC_000011.9:g.113283688") and
      variantCall("NC_000011.9:g.113282275") and
      variantCall("NC_000011.9:g.113346251") and
      variantCall("NC_000011.9:g.113270828") and
      variantCall("NC_000011.9:g.113331532") and
      variantCall("NC_000011.9:g.113283459") 
    }
    normal={
      (variantCall("NC_000011.9:g.[113346251=];[113346251=]") OR variantCall("NC_000008.10:g.[113346251A>AG];[113346251=]") ) and 
      (variantCall("NC_000011.9:g.[113283484=];[113283484=]") OR variantCall("NC_000011.9:g.[113283484G>C];[113283484=]") ) and
      (variantCall("NC_000011.9:g.[113283688=];[113283688=]") OR variantCall("NC_000011.9:g.[113283688C>A];[113283688=]") ) and
      variantCall("NC_000011.9:g.[113282275=];[113282275=]") and
      (variantCall("NC_000011.9:g.[113346251=];[113346251=]") OR variantCall("NC_000008.10:g.[113346251A>AG];[113346251=]") ) and 
      (variantCall("NC_000011.9:g.[113270828=];[113270828=]") OR variantCall("NC_000011.9:g.[113270828G>A];[113270828=]") ) and
      (variantCall("NC_000011.9:g.[113331532=];[113331532=]") OR variantCall("NC_000011.9:g.[113331532G>A];[113331532=]") ) and
      (variantCall("NC_000011.9:g.[113283459=];[113283459=]") OR variantCall("NC_000011.9:g.[113283459G>A];[113283459=]") )
    } />   
  <Indicator icon="gene" name="GRIK3" link="/report/grik3" require={
      variantCall("NC_000001.10:g.37325477") and
      variantCall("NC_000001.10:g.37449595")
    } 
    normal={
    variantCall("NC_000001.10:g.[37325477=];[37325477=]") and 
    (variantCall("NC_000001.10:g.[37449595C>T];[37449595C>T]") OR variantCall("NC_000001.10:g.[37449595=];[37449595=]") )
    } />   
 <Indicator icon="gene" name="GRIK2" link="/report/grik2" require={
      variantCall("NC_000006.11:g.101966454") 
    }
    normal={
      variantCall("NC_000006.11:g.[101966454=];[101966454=]")
    } />
  <Indicator icon="gene" name="HSD11B1" link="/report/hsd11b1" require={
      variantCall("NC_000005.9:g.133482348") and 
      variantCall("NC_000005.9:g.111358802") and 
      variantCall("NC_000001.10:g.209905734") and
      variantCall("NC_000001.10:g.209885318") and
      variantCall("NC_000001.10:g.209887718")
    }
    normal={
      (variantCall("NC_000005.9:g.[133482348=];[133482348=]") OR variantCall("NC_000005.9:g.[133482348G>A];[133482348G>A]") ) and 
      (variantCall("NC_000005.9:g.[111358802=];[111358802=]") OR variantCall("NC_000005.9:g.[111358802T>C];[111358802T>C]") ) and
      variantCall("NC_000001.10:g.[209905734=];[209905734=]") and
      (variantCall("NC_000001.10:g.[209885318=];[209885318=]") OR variantCall("NC_000001.10:g.[209885318C>A];[209885318=]") ) and 
      variantCall("NC_000001.10:g.[209887718T>C];[209887718T>C]")
    } />   
  <Indicator icon="gene" name="HTR2A" link="/report/htr2a" require={
      variantCall("NC_000013.10:g.47466549") and 
      variantCall("NC_000013.10:g.47469940") and 
      variantCall("NC_000013.10:g.47421836") and
      variantCall("NC_000013.10:g.47423086") and
      variantCall("NC_000013.10:g.47471478") and
      variantCall("NC_000013.10:g.47409034") and
      variantCall("NC_000013.10:g.47411985") and
      variantCall("NC_000013.10:g.47440560") 
    }
    normal={
      variantCall("NC_000013.10:g.[47466549=];[47466549=]") and 
      variantCall("NC_000013.10:g.[47469940=];[47469940=]") and
      variantCall("NC_000013.10:g.[47421836=];[47421836=]") and
      variantCall("NC_000013.10:g.[47423086=];[47423086=]") and
      variantCall("NC_000013.10:g.[47471478=];[47471478=]") and
      variantCall("NC_000013.10:g.[47409034=];[47409034=]") and
      variantCall("NC_000013.10:g.[47411985=];[47411985=]") and
      variantCall("NC_000013.10:g.[47440560=];[47440560=]")
    } />   
  <Indicator icon="gene" name="IFNG" link="/report/ifng" require={
      variantCall("NC_000005.9:g.40831942") and
      variantCall("NC_000012.11:g.68550162")
    } 
    normal={
    variantCall("NC_000005.9:g.[40831942=];[40831942=]") and 
    (variantCall("NC_000012.11:g.[68550162A>G];[68550162=]") OR variantCall("NC_000012.11:g.[68550162=];[68550162=]") )
    } />   
  <Indicator icon="gene" name="ILI2B" link="/report/ili2b" require={
      variantCall("NC_000005.9:g.158742014") and 
      variantCall("NC_000005.9:g.158750013") and 
      variantCall("NC_000005.9:g.158742950") 
    }
    normal={
      variantCall("NC_000005.9:g.[158742014=];[158742014=]") and 
      variantCall("NC_000005.9:g.[158750013=];[ 158750013=]") and
      (variantCall("NC_000005.9:g.[158742950T>G];[158742950T>G]") OR variantCall("NC_000005.9:g.[158742950=];[158742950=]") ) 
    } />   
  <Indicator icon="gene" name="NOS3" link="/report/nos3" require={
      variantCall("NC_000007.13:g.150696008") and 
      variantCall("NC_000007.13:g.150707488") and 
      variantCall("NC_000007.13:g.150708089") and
      variantCall("NC_000007.13:g.15069007") and
      variantCall("NC_000018.9:g.9986548")
    }
    normal={
      variantCall("NC_000007.13:g.[150696008=];[150696008=]") and 
      variantCall("NC_000007.13:g.[150707488=];[150707488=]") and 
      variantCall("NC_000007.13:g.[150708089=];[150708089=]") and
      (variantCall("NC_000007.13:g.[150690079C=];[150690079C=]") OR variantCall("NC_000007.13:g.[150690079C=];[150690079=]") ) and 
      (variantCall("NC_000018.9:g.[9986548G>C];[9986548G>C]") OR variantCall("NC_000018.9:g.[9986548G>C];[9986548=]") ) 
    } />   
  <Indicator icon="gene" name="NPAS2" link="/report/npas2" require={
      variantCall("NC_000002.11:g.101539790") 
    }
    normal={
      variantCall("NC_000002.11:g.[101539790=];[101539790=]")
    } />
  <Indicator icon="gene" name="NR3C1" link="/report/nr3c1" require={
      variantCall("NC_000005.9:g.126857714") and 
      variantCall("NC_000005.9:g.126855889") and 
      variantCall("NC_000005.9:g.126859406") and
      variantCall("NC_000024.9:g.24604538") and
      variantCall("NC_000005.9:g.158300798") and
      variantCall("NC_000005.9:g.158304022") and
      variantCall("NC_000005.9:g.126858444") and
      variantCall("NC_000005.9:g.158295782") and
      variantCall("NC_000005.9:g.158299079") and
      variantCall("NC_000005.9:g.142759785") and
      variantCall("NC_000005.9:g.142661889") and
      variantCall("NC_000005.9:g.142722353") and
      variantCall("NC_000005.9:g.142680344") and
      variantCall("NC_000005.9:g.142661490") and
      variantCall("NC_000005.9:g.142696036")
    }
    normal={
      (variantCall("NC_000005.9:g.[126857714G>A];[126857714G>A]") 
       or variantCall("NC_000005.9:g.[126857714=];[126857714=]")) 
      and
      (variantCall("NC_000005.9:g.[126855889A>T];[126855889=]") 
       or variantCall("NC_000005.9:g.[126855889=];[126855889=]")) 
      and
      variantCall("NC_000005.9:g.[126859406=];[126859406=]") 
      and
      (variantCall("NC_000024.9:g.[24604538A>G];[24604538A>G]") 
       or variantCall("NC_000024.9:g.[24604538A>G];[24604538=]")) 
      and
      (variantCall("NC_000005.9:g.[158300798C>A];[158300798C>A]") 
       or variantCall("NC_000005.9:g.[158300798=];[158300798=]")) 
      and
      (variantCall("NC_000005.9:g.[158304022C>T];[158304022=]") 
       or variantCall("NC_000005.9:g.[158304022=];[158304022=]")) 
      and
      (variantCall("NC_000005.9:g.[126858444G>A];[126858444=]") 
       or variantCall("NC_000005.9:g.[126858444=];[126858444=]")) 
      and
      (variantCall("NC_000005.9:g.[158295782T>C];[158295782T>C]") 
       or variantCall("NC_000005.9:g.[158295782T>C];[158295782=]")) 
      and
      (variantCall("NC_000005.9:g.[158299079C>T];[158299079C>T]") 
       or variantCall("NC_000005.9:g.[158299079=];[158299079=]")) 
      and
      variantCall("NC_000005.9:g.[142759785=];[142759785=]") 
      and
      variantCall("NC_000005.9:g.[142661889=];[142661889=]") 
      and
      variantCall("NC_000005.9:g.[142722353=];[142722353=]") 
      and
      (variantCall("NC_000005.9:g.[142680344C>A];[142680344C>A]") 
       or variantCall("NC_000005.9:g.[142680344C>A];[ 142680344=]")) 
      and
      variantCall("NC_000005.9:g.[142661490=];[142661490=]") 
      and
      variantCall("NC_000005.9:g.[142687494=];[142687494=]") 
      and
      variantCall("NC_000005.9:g.[142696036=];[142696036=]") 
    } />   
  <Indicator icon="gene" name="POMC" link="/report/pomc" require={
      variantCall("NC_000018.9:g.20340572") and 
      variantCall("NC_000006.11:g.42297712") and 
      variantCall("NC_000002.11:g.25387181") and
      variantCall("NC_000002.11:g.25384833") and
      variantCall("NC_000002.11:g.25389224")
    }
    normal={
      (variantCall("NC_000018.9:g.[20340572T>C];[20340572=]") OR variantCall("NC_000018.9:g.[20340572=];[20340572=]") ) and 
      variantCall("NC_000006.11:g.[42297712=];[42297712=]") and 
      (variantCall("NC_000002.11:g.[25387181T>G];[25387181=]") OR variantCall("NC_000002.11:g.[25387181=];[25387181=]") ) and 
      (variantCall("NC_000002.11:g.[25384833T>C];[25384833=]") OR variantCall("NC_000002.11:g.[25384833=];[25384833=]") ) and 
      (variantCall("NC_000002.11:g.[25389224A>G];[25389224=]") OR variantCall("NC_000002.11:g.[25389224=];[25389224=]") ) 
    } />   
  <Indicator icon="gene" name="SCN9A" link="/report/scn9a" require={
      variantCall("NC_000002.11:g.167155438") and 
      variantCall("NC_000002.11:g.167149864") and 
      variantCall("NC_000002.11:g.167159672") and
      variantCall("NC_000002.11:g.167129241") and
      variantCall("NC_000002.11:g.167133643") and
      variantCall("NC_000002.11:g.167143072")
    }
    normal={
      (variantCall("NC_000002.11:g.[167155438T>G];[167155438=]") OR variantCall("NC_000002.11:g.[167155438=];[167155438=]") ) and 
      (variantCall("NC_000002.11:g.[167149864G>A];[167149864=]") OR variantCall("NC_000002.11:g.[167149864=];[167149864=]") ) and 
      (variantCall("NC_000002.11:g.[167159672G>T];[167159672=]") OR variantCall("NC_000002.11:g.[167159672=];[167159672=]") ) and 
      (variantCall("NC_000002.11:g.[167129241G>A];[167129241=]") OR variantCall("NC_000002.11:g.[167129241=];[167129241=]") ) and 
      (variantCall("NC_000002.11:g.[167133643C>T];[167133643=]") OR variantCall("NC_000002.11:g.[167133643=];[167133643=]") ) and
      (variantCall("NC_000002.11:g.[167143072G>C];[167143072=]") OR variantCall("NC_000002.11:g.[167143072=];[167143072=]") )
    } />   
  <Indicator icon="gene" name="SCL6A4" link="/report/scl6a4" require={
      variantCall("NC_000017.10:g.28564346") and 
      variantCall("NC_000017.10:g.28525011") and
      variantCall("NC_000017.10:g.28526475") and 
      variantCall("NC_000017.10:g.28546914") and
      variantCall("NC_000017.10:g.28531793") and
      variantCall("NC_000017.10:g.28523726")
    }
    normal={
      variantCall("NC_000017.10:g.[28564346T>C];[28564346T>C]") and
      (variantCall("NC_000017.10:g.[28526475T>C];[28526475=]") OR variantCall("NC_000017.10:g.[28526475=];[28526475=]") ) and 
      (variantCall("NC_000017.10:g.[28525011A>C];[28525011=]") OR variantCall("NC_000017.10:g.[28525011A>C];[28525011A>C]") ) and 
      (variantCall("NC_000017.10:g.[28546914C>T];[28546914C>T]") OR variantCall("NC_000017.10:g.[28546914=];[28546914=]") ) and 
      variantCall("NC_000017.10:g.[28531793=];[28531793=]") and
      (variantCall("NC_000017.10:g.[28523726G>T];[28523726G>T]") OR variantCall("NC_000017.10:g.[28523726=];[28523726=]") )
    } />   
  <Indicator icon="gene" name="TPH2" link="/report/tph2" require={
      variantCall("NC_000012.11:g.72372601") and 
      variantCall("NC_000012.11:g.72360264") and 
      variantCall("NC_000012.11:g.72412220") and
      variantCall("NC_000012.11:g.72336512")
    }
    normal={
      variantCall("NC_000012.11:g.[72372601=];[72372601=]") and
      variantCall("NC_000012.11:g.[72360264A>G];[72360264A>G]") and
      variantCall("NC_000012.11:g.[72412220=];[72412220=]") and
      variantCall("NC_000012.11:g.[72336512=];[72336512=]") and
    } />   
  <Indicator icon="gene" name="TRPC2" link="/report/trpc2" require={
      variantCall("NC_000011.9:g.3650086") and
      variantCall("NC_000011.9:g.3638061")
    }
    normal={
      (variantCall("NC_000011.9:g.[3650086G>T];[3650086G>T]") OR variantCall("NC_000011.9:g.[3650086=];[3650086=]") ) and
      (variantCall("NC_000011.9:g.[3638061G>A];[3638061=]") OR variantCall("NC_000011.9:g.[3638061=];[3638061=]") )
    } />   
  <Indicator icon="gene" name="TRPC4" link="/report/trpc4" require={
      variantCall("NC_000013.10:g.38368012") and 
      variantCall("NC_000013.10:g.38242481") and 
      variantCall("NC_000013.10:g.38230542") and
      variantCall("NC_000013.10:g.38367949")
    }
    normal={
      (variantCall("NC_000013.10:g.[38368012G>T];[38368012=]") OR variantCall("NC_000013.10:g.[38368012=];[38368012=]") ) and
      (variantCall("NC_000013.10:g.[38242481G>T];[38242481G>T]") OR variantCall("NC_000013.10:g.[38242481G>T];[38242481=]") ) and
      (variantCall("NC_000013.10:g.[38230542G>A];[38230542G>A]") OR variantCall("NC_000013.10:g.[38230542G>A];[38230542=]") ) and
      (variantCall("NC_000013.10:g.[38367949C>T];[38367949=]") OR variantCall("NC_000013.10:g.[38367949=];[38367949=]") )
    } />   
  <Indicator icon="gene" name="TRPM3" link="/report/trpm3" require={
      variantCall("NC_000009.11:g.73980222") and 
      variantCall("NC_000009.11:g.74042243") and 
      variantCall("NC_000009.11:g.74017174") and
      variantCall("NC_000009.11:g.74018496") and
      variantCall("NC_000009.11:g.73424964") and 
      variantCall("NC_000009.11:g.74032148") and 
      variantCall("NC_000009.11:g.73405864") and
      variantCall("NC_000009.11:g.73435028") and 
      variantCall("NC_000009.11:g.73437824") and 
      variantCall("NC_000009.11:g.73231662") and 
      variantCall("NC_000009.11:g.73220691") and
      variantCall("NC_000009.11:g.73225802") and
      variantCall("NC_000009.11:g.73314011") and 
      variantCall("NC_000009.11:g.73410410") and
      variantCall("NC_000009.11:g.73416062") and 
      variantCall("NC_000009.11:g.73225802") and 
      variantCall("NC_000009.11:g.73204431") and 
      variantCall("NC_000009.11:g.73204431") and
      variantCall("NC_000009.11:g.73306551")  
    }
    normal={
      (variantCall("NC_000009.11:g.[73980222T>C];[73980222=]") OR variantCall("NC_000013.10:g.[73980222=];[73980222=]") ) and
      (variantCall("NC_000009.11:g.[74042243G>T];[74042243=]") OR variantCall("NC_000013.10:g.[74042243=];[74042243=]") ) and
      (variantCall("NC_000009.11:g.[74017174C>T];[74017174=]") OR variantCall("NC_000013.10:g.[74017174=];[74017174=]") ) and
      (variantCall("NC_000009.11:g.[74018496C>T];[74018496=]") OR variantCall("NC_000013.10:g.[74018496=];[74018496=]") ) and
      (variantCall("NC_000009.11:g.[73424964G>A];[73424964G>A]") OR variantCall("NC_000013.10:g.[73424964=];[73424964=]") ) and
      (variantCall("NC_000009.11:g.[74032148T>G];[74032148T>G]") OR variantCall("NC_000013.10:g.[74032148T>G];[74032148=]") ) and
      variantCall("NC_000009.11:g.[73405864=];[73405864=]") and
      (variantCall("NC_000009.11:g.[73435028G>A];[73435028G>A]") OR variantCall("NC_000013.10:g.[73435028G>A];[73435028=]") ) and
      (variantCall("NC_000009.11:g.[73437824A>G];[73437824A>G]") OR variantCall("NC_000013.10:g.[73437824=];[73437824=]") ) and
      (variantCall("NC_000009.11:g.[73231662C>T];[73231662C>T]") OR variantCall("NC_000013.10:g.[73231662C>T];[73231662=]") ) and
      (variantCall("NC_000009.11:g.[73220691A>G];[73220691A>G]") OR variantCall("NC_000013.10:g.[73220691A>G];[73220691=]") ) and
      (variantCall("NC_000009.11:g.[73225802T>G];[73225802=]") OR variantCall("NC_000013.10:g.[73225802=];[73225802=]") ) and
      variantCall("NC_000009.11:g.[73314011=];[73314011=]") and
      variantCall("NC_000009.11:g.[73410410=];[73410410=]") and
      variantCall("NC_000009.11:g.[73416062G>A];[73416062G>A]") and
      variantCall("NC_000009.11:g.[73225802=];[73225802=]") and
      variantCall("NC_000009.11:g.[73204431=];[73204431=]") and
      variantCall("NC_000009.11:g.[73204431A>G];[73204431A>G]") and
      variantCall("NC_000009.11:g.[73306551C>A];[73306551C>A]")
    } />       
  <Indicator icon="gene" name="TRPM8" link="/report/trpm8" require={
      variantCall("NC_000002.11:g.234917377") and 
      variantCall("NC_000002.11:g.234919314") and 
      variantCall("NC_000002.11:g.234854550") and
      variantCall("NC_000002.11:g.234825093") and
      variantCall("NC_000002.11:g.234883380")
    }
    normal={
      (variantCall("NC_000002.11:g.[234917377G>A];[234917377G>A]") OR variantCall("NC_000002.11:g.[234917377=];[234917377=]") ) and 
      (variantCall("NC_000002.11:g.[234919314G>A];[234919314G>A]") OR variantCall("NC_000002.11:g.[234919314=];[234919314=]") ) and 
      variantCall("NC_000002.11:g.[234854550=];[234854550=]")  and 
      variantCall("NC_000002.11:g.[234825093=];[234825093=]")  and 
      (variantCall("NC_000002.11:g.[234883380A>G];[234883380A>G]") OR variantCall("NC_000002.11:g.[234883380=];[234883380=]") ) 
    } /> 
</IndicatorPanel>

# What treatments are available?		

Since there is not yet a cure for chronic fatigue syndrome (ME/CFS), the key to living with ME/CFS is treating the most problematic symptoms. [Medications](https://www.cdc.gov/me-cfs/treatment/index.html) for pain, sleep, depression, anxiety, or ADHD may be used to treat certain ME/CFS symptoms. If necessary, patients may be referred to counselors, pain specialists, and dieticians. Doctors may also suggest lifestyle changes, such as [activity pacing and better sleep hygiene](https://www.cdc.gov/me-cfs/treatment/index.html). At home, patients may try [yoga, meditation, deep breathing, or relaxation exercises](https://www.cdc.gov/me-cfs/treatment/index.html).
