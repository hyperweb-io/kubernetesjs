{{- define "interweb.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "interweb.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" -}}
{{- end -}}

{{- define "interweb.labels" -}}
{{- $root := .root -}}
{{- $labels := dict -}}
{{- $_ := set $labels "app.kubernetes.io/name" (printf "%s" .name) -}}
{{- $_ := set $labels "app.kubernetes.io/instance" $root.Release.Name -}}
{{- $_ := set $labels "app.kubernetes.io/managed-by" $root.Release.Service -}}
{{- $_ := set $labels "app.kubernetes.io/part-of" (include "interweb.name" $root) -}}
{{- $_ := set $labels "helm.sh/chart" (include "interweb.chart" $root) -}}
{{- if .component }}
{{- $_ := set $labels "app.kubernetes.io/component" (printf "%s" .component) -}}
{{- end -}}
{{- range $key, $value := $root.Values.global.labels }}
{{- $_ := set $labels $key (printf "%v" $value) -}}
{{- end -}}
{{- if .extra }}
{{- range $key, $value := .extra }}
{{- $_ := set $labels $key (printf "%v" $value) -}}
{{- end -}}
{{- end -}}
{{- toYaml $labels -}}
{{- end -}}
