/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react'
import { get, isEmpty } from 'lodash'

import { Checkbox, Tag } from '@kube-design/components'
import { Text } from 'components/Base'

import styles from './index.scss'

export default class CheckItem extends Component {
  handleCheck = () => {
    const { roleTemplates, data, onChange } = this.props

    let newTemplates = [...roleTemplates]
    if (newTemplates.includes(data.name)) {
      newTemplates = newTemplates.filter(item => item !== data.name)
    } else {
      newTemplates.push(data.name)
    }

    onChange([...newTemplates, ...this.getDependencies(newTemplates)])
  }

  getDependencies = names => {
    const { roleTemplatesMap } = this.props
    const dependencies = []

    if (isEmpty(names)) {
      return dependencies
    }

    names.forEach(name => {
      const template = roleTemplatesMap[name]
      if (template.dependencies) {
        template.dependencies.forEach(dep => {
          if (!names.includes(dep) && !dependencies.includes(dep)) {
            dependencies.push(dep)
          }
        })
      }
    })

    if (dependencies.length > 0) {
      dependencies.push(...this.getDependencies(dependencies))
    }

    return dependencies
  }

  handleCheckboxClick = e => e.stopPropagation()

  render() {
    const { roleTemplates, roleTemplatesMap, data } = this.props

    return (
      <div className={styles.checkItem} onClick={this.handleCheck}>
        <Checkbox
          checked={roleTemplates.includes(data.name)}
          onClick={this.handleCheckboxClick}
        />
        <Text
          title={t(data.aliasName)}
          description={t(
            `${data.aliasName.toUpperCase().replace(/\s+/g, '_')}_DESC`
          )}
        />
        {data.dependencies.length > 0 && (
          <div className={styles.extra}>
            {t('Depend on')}:{' '}
            {data.dependencies.map(item => (
              <Tag className={styles.tag} type="info" key={item}>
                {t(get(roleTemplatesMap, `[${item}].aliasName`))}
              </Tag>
            ))}
          </div>
        )}
      </div>
    )
  }
}
