# What does the MTHFR gene do?

MTHFR is involved in the production of folate (also known as B9). Folate is a precursor to the amino acid
methionine. The body uses [methionine](https://ghr.nlm.nih.gov/condition/hypermethioninemia) to make proteins, red and white blood cells, DNA, and other important compounds, including neurotransmitters such as serotonin, dopamine, and norepinephrine. Folate deficiency may cause [fatigue, pins and needles (paraesthesia), muscle weakness, disturbed vision, depression, confusion, and memory problems](https://medlineplus.gov/ency/article/000354.htm).

This gene is located on chromosome 1. The enzyme it creates acts in your endocrine system and pancreas.

<TopicList endocrineSystem pancreas />

<GeneMap name="MTHFR" interval="NC_000001.11:g.11785730_11806103"> 

  # What are some common mutations of MTHFR?

  There are two well-known variants in MTHFR: [C677T](http://gnomad.broadinstitute.org/variant/1-11856378-G-A) and [A1298C](https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=1801131).

  <# C677T #>
  <Variant hgvs="NC_000022.11:g.19963748G>A" name="C677T"> 

    This variant is a change at a specific point in the MTHFR gene from cytosine (C) to thymine (T) resulting in incorrect enzyme function. This substitution of a single nucleotide is known as a missense variant.

  </Variant>
  
  <# A1298C #>
  <Variant hgvs="NC_000022.11:g.19962712C>T" name="A1298C"> 

    This variant is a change at a specific point in the MTHFR gene from adenine (A) to cytosine (C) resulting in incorrect enzyme function. This substitution of a single nucleotide is known as a missense variant.

  </Variant>
</GeneMap>

<# C677T #>
<AnalysisBox>
  <Analysis name="C677T"
            case={ variantCall("NC_00001.11:g.[14783C>T];[14783=]") } > 

    # What does this mean?

    People with this variant have one copy of the [C677T](http://gnomad.broadinstitute.org/variant/1-11856378-G-A) variant. This substitution of a single nucleotide is known as a missense mutation.

    # What is the effect of this variant?

    You are in the Mild Loss of Function category. See below for more information.

    # How common is this genotype in the general population?

    <piechart percentage=30 />
  </Analysis>

  <Analysis name="C677T"
            case={ variantCall("("NC_00001.11:g.[14783C>T];[14783C>T]") }> 

    # What does this mean?

    People with this variant have two copies of the [C677T](http://gnomad.broadinstitute.org/variant/1-11856378-G-A) variant. This substitution of a single nucleotide is known as a missense mutation.

    # What is the effect of this variant?

    You are in the Moderate Loss of Function category. See below for more information.

    # How common is this genotype in the general population?

    <piechart percentage=9 />
  </Analysis>

  <Analysis name="C677T"
            case={ variantCall("NC_00001.11:g.[14783=];[14783=]") }> 

    # What does this mean?

    Your MTHFR gene has no variants. A normal gene is referred to as a "wild-type" gene.

    # What is the effect of this variant?

    Your variant is not associated with any loss of function.

    # How common is this genotype in the general population?

    <Piechart percentage=61 />
  </Analysis>
  
  <Analysis name="A1298C"
            case={ variantCall("NC_000001.11:g.[11794419T>G];[11794419T=]") > 

    # What does this mean?

    People with this variant have one copy of the [A1298C](https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=1801131) variant. This substitution of a single nucleotide is known as a missense mutation.

    # What is the effect of this variant?

    You are in the Moderate Loss of Function category. See below for more information.

    # How common is this genotype in the general population?

    <piechart percentage=20 />
  </Analysis>

  <Analysis name="A1298C"
            case={ variantCall("NC_000001.11:g.[11794419T>G];[11794419T>G]") }> 

    # What does this mean?

    People with this variant have two copies of the [A1298C](https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=1801131) variant. This substitution of a single nucleotide is known as a missense mutation.

    # What is the effect of this variant?

    You are in the Mild Loss of Function category. See below for more information.

    # How common is this genotype in the general population?

    <piechart percentage=4 />
  </Analysis>
  <Analysis case={ variantCall("NC_000001.11:g.[11794419T=];[11794419T=]") }          title="A1298C"> 

    # What does this mean?

    Your MTHFR gene has no variants. A normal gene is referred to as a "wild-type" gene.

    # What is the effect of this variant?

    Your variant is not associated with any loss of function.

    # How common is this genotype in the general population?

    <piechart percentage=76 />
  </Analysis>
  
  <# C677T (C;T) ; A1298C (A;C) #>
  <Analysis case={ variantCall("NC_00001.11:g.[14783C>T];[14783=]" case={ variantCall("NC_000001.11:g.[11794419T>G];[11794419T=]"           title="C677T A1298C"> 

    # What does this mean?

    People with this variant have one copy of the C677T variant and the A1298C variant. This substitution of a single nucleotide is known as a missense mutation.

    # What is the effect of this variant?

    You are in the Severe Loss of Function category. See below for more information.

    # How common is this genotype in the general population?

    <piechart percentage=6 />
  </Analysis>

  <# wildtype #>
  <Analysis name="wildtype" 
            case={ variantCall("NC_00001.11:g.[14783=];[14783=]") } >

    # What does this mean?

    Your MTHFR gene has no variants. A normal gene is referred to as a "wild-type" gene.

    # What is the effect of this variant?

    This variant is not associated with increased risk.

    # How common is this genotype in the general population?

    <piechart percentage= />
  </Genotype>

  <# unknown #>
  <Analysis case=true>

    # What does this mean?

    Your MTHFR gene has an unknown variant.

    # What is the effect of this variant?

    The effect is unknown.

    # How common is this genotype in the general population?

    <piechart percentage= />
  </Analysis>
</AnalysisBox>

<# A1298C (C:C) C677T (C:T) #>

| Variant       |Population %           | 
| :-------------: |:-------------:|
| A1298C (C:C)  | 4% |
| C677T (C:T) | 30%      |

# How do changes in MTHFR affect people?

For the vast majority of people, the overall risk associated with the common MTHFR variants is small and does not impact treatment. It is possible that variants in this gene interact with other gene variants, which is the reason for our inclusion of this gene.

# Mild Loss of Function

People with the following variants have a slightly reduced efficacy of processing folate [(82% of normal function)](https://www.ncbi.nlm.nih.gov/pubmed/25902009). In ME/CFS, [hypomethylation](http://dx.doi.org/10.4172/2155-9899.1000228), which is greatly affected by the vitamins B12 and folate, is seen in a majority of certain immune cells. The low B12 and higher homocysteine levels correlate significantly with ratings of [mental fatigue](https://www.ncbi.nlm.nih.gov/pubmed/25902009).

# What should I do about this?

Some people with mild loss of function variant may benefit from supplementing their diets with an [oral folic acid](https://www.ncbi.nlm.nih.gov/pubmed/25902009) supplement. Consult your physician. 

<# A1298C (A:C) C677T (T:T) #>

| Variant        |Population %   | 
|:--------------:|:-------------:|
| A1298C (A:C)   | 20%           |
| C677T (T:T)    | 9%            |

# Moderate Loss of Function

People with the following mutations have a drastically reduced efficacy of processing folate ([30% of normal function)](https://www.ncbi.nlm.nih.gov/pubmed/25902009).  In ME/CFS, [hypomethylation](http://dx.doi.org/10.4172/2155-9899.1000228), which is greatly affected by the vitamins B12 and folate, is seen in a majority of certain immune cells. The low B12 and higher homocysteine levels correlate significantly with ratings of [mental fatigue](https://www.ncbi.nlm.nih.gov/pubmed/25902009).

# What should I do about this?

Most people with the moderate loss of function variant may benefit from supplementing their diets with an [oral folic acid](https://www.ncbi.nlm.nih.gov/pubmed/25902009) supplement. However, opioid analgesics and other drugs that have to be demethylated (the removal of one methyl CH3 group) as part of their metabolism negatively impact MTHFR function.  Consult your physician. 

<# C677T (C;T) ; A1298C (A;C) #>

| Variant       |Population %           | 
| :-------------: |:-------------:|
| C677T (C;T) ; A1298C (A;C) | 6% |

# Severe Loss of Function

People with the following mutations have a drastically reduced efficiency of processing folate ([15% of normal function](https://www.ncbi.nlm.nih.gov/pubmed/25902009).  The elevated homocysteine levels are associated with low thyroid hormones (hypothyroidism), chronic conditions like obesity, diabetes, high cholesterol, physical inactivity, and high blood pressure. However, very high homocysteine levels are rarely caused by only these variants. 

In ME/CFS, [hypomethylation](http://dx.doi.org/10.4172/2155-9899.1000228), which is greatly affected by the vitamins B12 and folate, is seen in a majority of certain immune cells. The low B12 and very elevated homocysteine levels correlate significantly with ratings of [mental fatigue](https://www.ncbi.nlm.nih.gov/pubmed/25902009).

# What should I do about this?
It is strongly recommended that people in this group take an [oral folic acid](https://www.ncbi.nlm.nih.gov/pubmed/25902009) supplement on a daily basis to provide blood saturations high enough to be a remedy for good and safe relief in CFS patients. However, 
opioid analgesics and other drugs that have to be demethylated (the removal of one methyl CH3 group) as part of their metabolism negatively impact MTHFR function. You should also be carefully evaluated for other factors known to affect [homocysteine](https://medlineplus.gov/druginfo/natural/1017.html), such as:

* Eye lens dislocations
* Unusual (Marfan type) body shape
* Stroke
* Blood clotting abnormalities
* Low thyroid hormones (hypothyroidism)

<# symptoms fatigue D005221 memory problems D008569 inflamation D007249 #>

# Symptoms
<TopicBar mesh_D005221 mesh_D008569 mesh_D007249 />

<# disease fatigue	D005221 fatigue, mental fatigue	D005222 fatigue, muscle fatigue	D018763 depression	D003866
hypothyroid	D007037 #>

<TopicBar mesh_D005221 mesh_D005222 mesh_D018763 mesh_D003866 mesh_D007037 />