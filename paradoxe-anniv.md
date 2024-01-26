---
title: Le paradoxe des anniversaires
fulltitle: Au-delà du paradoxe des anniversaires
layout: page
---

# Introduction

Dans un groupe de 20 personnes, la probabilité qu'au moins deux d'entre elles soient nées le même jour est d'environ 41 %.
Nous sommes loin de l'intuitif (1/20)² = 0,0025 % que nous souffle notre intuition !
C'est ce que l'ingénieur [Richard von Mises](https://fr.wikipedia.org/wiki/Richard_von_Mises), ayant popularisé ce problème de probabilité, a appelé le paradoxe des anniversaires.

La démonstration part d'une modélisation simple où il est aussi probable de naître un jour qu'un autre.
On omet également les années bissextiles.
La probabilité $\alpha$ que chaque personne du groupe soit née un jour différent correspond à celle que la deuxième soit née un autre jour que la première, et que la troisième soit née un autre jour que les précédentes, etc.
Autrement dit, la première personne peut être née n'importe lequel des 365 jours de l'année, mais la deuxième ne peut être né qu'un des 364 jours restants, etc.
On en déduit que $\alpha$ est l'intersection, et donc un produit, de probabilités indépendantes
\begin{equation}
\alpha = \frac{365}{365} \times \frac{364}{365} \times \frac{363}{365} \times \ldots \times \frac{365 - n + 1)}{365}
= \frac{365!}{(365-n)! 365^n}
\end{equation}
où $n$ est la taille du groupe.
Par conséquent, la probabilité qu'au moins deux personnes du groupe soient nées le même jour est $1 - \alpha$.

Mais étudions un cas plus complexe : quelle est la probabilité qu'**exactement** deux personnes soit nées le même jour ? Ou plus généralement, qu'exactement $X$ personnes soient nées le même jour ?

# Cas exact général

$X$ est une variable aléatoire comprise entre 1 et $n$, la taille du groupe.
$X = 1$ correspond au cas où chaque personne est née un jour différent.
Nous avons déjà calculé sa probabilité : $\Pr(X = 1) = \alpha$.
Pour les autres valeurs de $X$, découpons d'abord le problème pour chaque jour.

Appelons $p_j$ La probabilité qu'une personne soit née le jour $j$.
Nous considérons le cas général où ces probabilités ne sont pas équivalentes.
Ceci est cohérent avec les [données de l'Insee](https://www.insee.fr/fr/statistiques/4655279) qui montrent une concentration des naissances entre juin et octobre pour l'année 2019.

![](assets/images/nb-naissances-jour-2019.png)

Pour tout $j \in \{ 1, \ldots, 365 \}$, nous pouvons créer la variable aléatoire $Y_j$ qui représente le nombre de personnes nées le $j$-ème jour de l'année.
Construisons également la variable $Z_j$ telle que $Z_j = k$ quand chaque personne du groupe est née un jour différent sauf $k$ personnes qui sont nées le même $j$-ème jour de l'année.
\begin{equation}
    \Pr(Z_j = k) = \Pr\left( Y_j = k \cap \left( \bigcap_{i \neq j} Y_i = 1 \right) \right)
\begin{equation}
Ainsi, $X = k$ personnes sont nées le même jour quand $Z_1 = k$ ou $Z_2 = k$ ou $Z_3 = k$…
Or, les $Z_j = k$ sont disjoints (ne peuvent arriver simultanément), donc la probabilité de leur union est la somme de leurs probabilités.
\begin{equation}
\Pr(X = k) = \Pr\left( \bigcup_{i \in \{ 1, \ldots, 365 \}} \left( Y_i = k \bigcap_{j \neq i} Y_j \right) \right)
= \sum_{i \in \{ 1, \ldots, 365} \Pr(Z_j = k)
\end{equation}

Les naissances sont des événements indépendants (on omet le cas des jumeaux).
Par conséquent, $Y_j$ suit une [loi binomiale](https://fr.wikipedia.org/wiki/Loi_binomiale) de paramètres $n$ et $p_j$.
\begin{equation}
Y_j \sim \mathcal B(n, p_j)
\end{equation}
Néanmoins, les $Y_j$ ne sont pas indépendants car si $k$ personnes sont nées un certain jour, alors nous savons que la probabilité que 